import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {HttpHelper, SearchRequest, SearchResult, SearchService, Utils} from "../shared/helper.service";
import {JConfirm} from "../shared/jconfirm";
import {AuthService} from "../shared/auth/auth.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {FileItem, FileUploader} from "ng2-file-upload";
import {configs} from "../shared/configs";
import * as firebase from "firebase";

declare var $: any;

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
})

export class ChatComponent implements OnDestroy, AfterViewInit {
    @Input('parent') parent: any;
    loadingContacts: boolean = false;
    contacts: Contact[] = [];
    chatContact: Contact = {};
    chatContactActive: boolean = false;
    sendingMsg: boolean = false;
    chats: any[] = [];
    composeMessage: string = '';
    loadingChats: boolean = false;
    user: any = {};
    chatPollingActive: boolean = false;
    checkingNewMessages: boolean = false;
    searchContactsTerm: string = '';
    filteredContacts: Contact[] = [];
    isAutoComplete: boolean = false;
    isAutoCompleteSearching: boolean = false;
    autoCompleteList: {
        'type': string,
        'name': string,
        'id': string,
    }[] = [];

    autoCompleteTerm: string = '';
    uploader: FileUploader;
    fileUploading: boolean = false;
    uploadedFiles: any[] = [];
    hasFileDropOver: any = false;
    unReadMessages: { [key: string]: number } = {};
    @Output() totalUnread: EventEmitter<number> = new EventEmitter<number>();
    showContactList: boolean = false;
    @ViewChild('chatInput') chatInput: ElementRef;
    autoCompleteKeyboardIndex: number = -1;
    initFindElInterval: number;


    /**
     * PROBLEM:
     * When file is over the drag area, the event returns true.
     * BUT!
     * if the user moves the mouse and the mouse encounters an element. The event will return false for instance and go back to true.
     * It is a bug from the drag drop plugin that we are using.
     * Therefore we got to set a timer to check false values and discard them
     * OK ok ok ok oko kkookokokasokdosaskaodkas
     *
     * TLDR: debounce that ..
     *
     * @param event
     */
    fileDropOver(event) {

        if (event) {
            this.hasFileDropOver = true;
            clearTimeout(this.fileDropOverTimeout);
            this.fileDropOverTimeout = setTimeout(() => {
                this.hasFileDropOver = false;
            }, 100);
        }
    }

    fileDropOverTimeout: number;

    constructor(
        public httpHelper: HttpHelper,
        public jconfirm: JConfirm,
        public fb: FormBuilder,
        public router: Router,
        public authService: AuthService,
        public utils: Utils,
        public searchService: SearchService,
    ) {
        this.user = this.authService.getUser();

        /**
         * Workaround outside angular to bind a click event.
         * : angular has a limitation that it does not render directives inside innerHTML
         * as its already bootstrapped. sweeeeeet ! 👌.
         */
        let that = this;
        $(document).on('click', '.chat-link', function () {
            let link = $(this).data('link');
            that.chatLink(link);
        });
    }

    /**
     * Link to navigate to page from the quick links
     *
     * @param link
     */
    chatLink(link) {
        this.router.navigateByUrl(link);
    }

    /**
     * Get random color from hash of the string.
     *
     * @param str
     */
    colorFromString(str: string): string {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    ngAfterViewInit() {
        this.loadContacts();

        // this.chatPollingActive = true;
        // this.checkNewMessagesLoop();

        this.searchService.onSearch('chat-page', (searchRequest: SearchRequest) => {
            let loadingId = this.searchService.showLoading();

            this.httpHelper.post('sec/chat/search_contacts', {
                term: searchRequest.term,
            }).subscribe((response: any) => {
                this.searchService.hideLoading(loadingId);
                if (response.status) {
                    // let users = response.data.users;
                    // let set: SearchResult[] = [];
                    // for (let user of users) {
                    //     set.push({
                    //         text: user.name || user.username,
                    //         subText: 'Contact',
                    //         tag: 'Chat',
                    //         group: 'Chat',
                    //         icon: 'ft ft-message-square',
                    //         type: this.searchService.typeChat,
                    //         typeValue: user.id,
                    //     });
                    // }
                    // console.log(set);
                    let contacts = <Contact[]>response.data.contacts;
                    let set: SearchResult[] = [];
                    for (let contact of contacts) {
                        set.push({
                            text: contact.name,
                            subText: 'Contact',
                            tag: 'Chat',
                            group: contact.contact_type == 'user' ? 'Chat' : 'Group chat',
                            icon: 'ft ft-message-square',
                            type: this.searchService.typeChat,
                            typeValue: [contact.contact_id, contact.contact_type],
                        });
                    }
                    console.log(set);
                    this.searchService.submitResults(searchRequest.term, set);
                }
            }, err => {
                this.searchService.hideLoading(loadingId);
            })
        });

        this.initUploader();
        this.initFirebase();
        this.initChatHelpers();
    }

    initFirebase() {
        var config = {
            apiKey: "AIzaSyCp9FjuzxiHZA_8b17V8fDO5YaGq5qXTGk",
            authDomain: "kpmg-a8d99.firebaseapp.com",
            databaseURL: "https://kpmg-a8d99.firebaseio.com",
            projectId: "kpmg-a8d99",
            storageBucket: "kpmg-a8d99.appspot.com",
            messagingSenderId: "355490116253"
        };
        firebase.initializeApp(config);
        let database = firebase.database();
        let id = this.user.id;
        let path = 'chats/' + id;

        database.ref(path).orderByChild('created_at').startAt(Math.round(+(new Date()) / 1000)).on('child_added', (data) => {
            this.incomingMsg(data.val());
        });
    }

    inputControlHeldDown: boolean = false;

    initChatHelpers() {
        // wait for the input to be visible and bind the event.
        this.initFindElInterval = setInterval(() => {
            if (typeof this.chatInput != 'undefined') {
                $(this.chatInput.nativeElement).on('keydown.chatInput', (e) => {
                    if (this.isAutoComplete) {
                        if (e.which == '38' || e.which == '40') {
                            e.preventDefault();
                            this.autoCompleteNavigate(e.which == '38' ? -1 : 1);
                        }
                        if (e.which == '13') {
                            e.preventDefault();
                            this.autoCompleteClick(this.autoCompleteList[this.autoCompleteKeyboardIndex]);
                        }
                    } else {
                        if (e.ctrlKey)
                            this.inputControlHeldDown = true;
                        else
                            this.inputControlHeldDown = false;

                        if (this.inputControlHeldDown && e.which == 13) {
                            e.preventDefault();
                            this.sendMsg();
                        }
                    }
                });
                $(this.chatInput.nativeElement).on('keyup', (e) => {
                    if (!e.ctrlKey)
                        this.inputControlHeldDown = false;
                });
                clearInterval(this.initFindElInterval);
            }
        }, 1000);
    }

    /**
     * Keyboard navigate through suggestions
     * @param dir
     */
    autoCompleteNavigate(dir: number = 1) {
        console.log(dir);
        this.autoCompleteKeyboardIndex += dir;
        if (this.autoCompleteKeyboardIndex < 0) {
            this.autoCompleteKeyboardIndex = this.autoCompleteList.length - 1;
        } else if (this.autoCompleteKeyboardIndex > this.autoCompleteList.length - 1) {
            this.autoCompleteKeyboardIndex = 0;
        }
    }

    /**
     * @todo WIP
     * @param msg
     */
    desktopNotification(msg) {
        let n = <any>Notification;

        if (n.permission !== "granted") {
            console.warn('Notification permissions not granted');
            n.requestPermission();
        }
        else {
            let notification = new Notification('Chat: ' + msg.from_user_name, {
                icon: '/assets/img/chat.png',
                body: msg.message,
            });
            let sound = new Audio('assets/audio/beep.mp3');
            sound.play();

            notification.onclick = () => {
                this.parent.chatIsOpen = true;
                window.focus();
                notification.close();
                let type = 'user';
                if (msg.chat_group_id)
                    type = 'group';

                this.chat(msg.chat_contact_id, type);
            };
        }
    }

    calcUnReadMessages() {
        let total = 0;
        for (let k of Object.keys(this.unReadMessages)) {
            total += this.unReadMessages[k];
        }
        this.totalUnread.emit(total);
    }

    /**
     * @todo WIP
     * @param msg
     */
    incomingMsg(msg) {
        console.log('new msg', msg);

        let fromContactId = msg.chat_contact_id.toString();
        let currentContactId = this.chatContact.contact_id.toString();

        if (fromContactId == currentContactId) {
            let [parsedChat] = this.parseChats([msg]);
            this.chats.push(parsedChat);
            this.scrollBottom();
        } else {
            if (typeof this.unReadMessages[fromContactId] === 'undefined')
                this.unReadMessages[fromContactId] = 0;
            this.unReadMessages[fromContactId] += 1;
            this.calcUnReadMessages();

            this.desktopNotification(msg);
        }
    }

    initUploader() {
        this.uploader = new FileUploader({
            url: configs.api_url + 'sec/upload/upload_doc',
        });
        this.uploader.onBuildItemForm = (file: FileItem, form: any) => {
            form.append('token', this.authService.getToken());
        };
        this.uploader.onBeforeUploadItem = (file: FileItem) => {
            this.fileUploading = true;
        };
        this.uploader.onCompleteItem = (file: FileItem, r: any) => {
            this.fileUploading = false;
            this.uploader.removeFromQueue(file);

            try {
                let response = JSON.parse(r);
                if (response.status) {
                    this.uploadedFiles.push({
                        name: response.data.name,
                        upload_id: response.data.id,
                    });
                } else {
                    this.utils.errorNotification(response.reason);
                }
            } catch (e) {
                this.utils.errorNotification();
            }
        };
        this.uploader.onAfterAddingFile = (file: FileItem) => {
            this.uploader.uploadAll();
        }
    }

    removeFromUploadedFiles(indx) {
        this.uploadedFiles.splice(indx, 1);
    }

    ngOnDestroy() {
        // this.chatPollingActive = false;
        this.searchService.offSearch('chat-page');
        clearInterval(this.initFindElInterval);

        try {
            // @todo: element is not found, div is destroyed.
            // destroy before close

            $(this.chatInput.nativeElement).off('keyup.chatInput');
            $(this.chatInput.nativeElement).off('keydown.chatInput');
        } catch (e) {
        }
    }

    isFullWidth: boolean = false;

    expandWidth() {
        this.parent.chatFullWidth = this.isFullWidth = !this.parent.chatFullWidth;
    }

    filterContacts() {
        if (this.searchContactsTerm) {
            this.filteredContacts = this.contacts.filter((contact) => {
                if (contact.contact_id == this.user.id)
                    return false;
                return (JSON.stringify(contact).toLowerCase().indexOf(this.searchContactsTerm.toLowerCase()) != -1);
            });
        } else {
            this.filteredContacts = this.contacts.filter((contact) => {
                return contact.contact_id != this.user.id;
            });
        }
    }

    /**
     * Polling new messages, @deprecated
     */
    checkNewMessagesLoop() {
        if (!this.chatContactActive) {
            setTimeout(() => {
                this.checkNewMessagesLoop();
            }, 1000);
            return;
        }

        if (!this.chatPollingActive)
            return;

        let latest_id = 0;
        if (this.chats.length) {
            latest_id = this.chats[this.chats.length - 1].chat_id;
        }

        this.checkingNewMessages = true;
        this.httpHelper.post('sec/chat/poll_new_chat', {
            user_id: this.chatContact.contact_id,
            latest_id: latest_id
        }).subscribe((response: any) => {
            this.checkingNewMessages = false;
            if (response.status) {
                let chats = response.data.chats;
                if (chats.length)
                    chats = this.parseChats(chats);
                for (let chat of chats) {
                    this.chats.push(chat);
                }
                if (chats.length)
                    this.scrollBottom();
            }
            setTimeout(() => {
                this.checkNewMessagesLoop();
            }, 3000);
        }, err => {
            this.checkingNewMessages = false;
            setTimeout(() => {
                this.checkNewMessagesLoop();
            }, 5000);
        });
    }

    sendMsg() {
        if (this.fileUploading) {
            this.utils.infoNotification('Please wait while files upload');
            return;
        }

        this.sendingMsg = true;
        this.httpHelper.post('sec/chat/compose', {
            toContact: this.chatContact,
            msg: this.composeMessage,
            attachments: this.uploadedFiles,
        }).subscribe((response: any) => {
            this.sendingMsg = false;
            if (response.status) {
                let chat = response.data.chat;
                // this.chats.push(chat);
                this.composeMessage = '';
                this.uploadedFiles = [];
                this.scrollBottom();
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.sendingMsg = false;
            this.utils.errorNotification();
        })
    }

    scrollBottom() {
        setTimeout(() => {
            $('.chat-scrollable').scrollTop($('.chat-scrollable')[0].scrollHeight);
        }, 200);
    }

    loadContacts() {
        this.loadingContacts = true;
        this.httpHelper.post('sec/chat/contacts')
            .subscribe((response: any) => {
                if (response.status) {
                    let contacts = response.data.contacts;

                    this.contacts = contacts;
                    this.filterContacts();
                } else {
                    this.utils.errorNotification(response.reason);
                }
            }, err => {
                this.loadingContacts = false;
                this.utils.errorNotification();
            })
    }

    autoCompleteClick(r) {
        if (!this.isAutoComplete)
            return;

        let msg = this.composeMessage;
        let indx = msg.lastIndexOf('@');

        if (indx != -1) {
            msg = msg.substring(0, indx + 1) + '' + r.type + ':' + r.id + ' ';
            this.composeMessage = msg;
            this.isAutoComplete = false;
            // setTimeout(() => {
            // }, 100);
            $('#chat-compose').focus();
        }

    }

    search(term) {
        this.isAutoCompleteSearching = true;
        this.httpHelper.post('sec/chat/search_attach', {
            term: term,
        }).subscribe((response: any) => {
            this.isAutoCompleteSearching = false;
            if (response.status) {
                this.autoCompleteList = response.data.list;
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.utils.errorNotification();
            this.isAutoCompleteSearching = false;
        })
    }

    composing() {
        let msg = this.composeMessage;
        if (msg.charAt(msg.length - 1) == ' ') {
            if (this.isAutoComplete) {
                console.log("auto complete inactive");
                this.isAutoComplete = false;
            }
        } else if (msg.charAt(msg.length - 1) == '@') {
            this.isAutoComplete = true;
            console.log("auto complete active");
        } else if (this.isAutoComplete) {
            let indx = msg.lastIndexOf('@');
            if (indx == -1) {
                console.log("auto complete inactive");
                this.isAutoComplete = false;
                return false;
            }
            let term = msg.substr(indx + 1);
            console.log('term', term);
            if (term == '@' || term == '') {
                this.autoCompleteList = [];
            } else {
                this.autoCompleteTerm = term;
                this.search(term);
            }
        }
    }

    chat(contact_id, contact_type) {
        let contacts = <Contact[]>this.contacts.filter((u) => {
            return u.contact_id == contact_id && u.contact_type == contact_type;
        });
        if (contacts.length) {
            let contact = contacts[0];
            this.chats = [];
            this.chatContact = contact;

            this.unReadMessages[this.chatContact.contact_id] = 0;
            this.calcUnReadMessages();

            this.chatContactActive = true;
            this.showContactList = false;
            this.loadChats();

            setTimeout(() => {
                $(this.chatInput.nativeElement).focus();
            }, 200);
        } else {
            this.utils.errorNotification('The user was not found in your chat list.')
        }
    }

    loadChats() {
        this.loadingChats = true;
        this.httpHelper.post('sec/chat/get_chats', {
            contact: this.chatContact,
        }).subscribe((response: any) => {
            this.loadingChats = false;
            if (response.status) {
                this.chats = this.parseChats(response.data.chats.reverse());
                this.scrollBottom();
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.loadingChats = false;
            this.utils.errorNotification();
        });
    }

    downloadAttachment(upload_id) {
        let path = configs.api_url + 'sec/chat/download_attachment/' + upload_id + '?token=' + this.authService.getToken();
        window.open(path);
    }

    parseChats(chats) {
        for (let indx in chats) {
            let chat = chats[indx];
            let variables = JSON.parse(chat['variables'] || '{}');
            chats[indx].attachments = JSON.parse(chat['attachments'] || '[]');
            chats[indx].userColor = this.colorFromString(chat['from_user_name']);

            if (variables) {
                for (let v of variables) {
                    let msg = <string>chats[indx].message;
                    msg = msg.replace(v.replace, this.composeLink(v));
                    chats[indx].message = msg;
                }
            }
        }
        return chats;
    }

    /**
     * Compose the inline link
     * @param v
     */
    composeLink(v) {
        let url: string = '';
        switch (v.type) {
            case 'sheet':
                url = '/ledger/details/' + v.id;
                break;
            case 'mapping':
                url = '/manage/ledger-format/view/' + v.id;
                break;
        }

        return `<span class="chat-link" title="Open link" data-link="${url}">${v.type}: ${v.name}</span>`;
    }

    createGroupModal() {
        let jcModal = this.jconfirm.confirm({
            title: 'Create chat group',
            content: `
                <div class="text-center pb-2 pt-1">
                    <i class="ft ft-users" style="font-size: 48px"></i>
                </div> 
                <div class="form-group">
                    <input type="text" class="groupNameInput form-control form-control-sm" placeholder="Enter group name">
                </div>
                <span class="text-muted">
                    <small>
                        Participants can be added after the group has been created.
                    </small>
                </span>
            `,
            buttons: {
                create: {
                    text: 'Create',
                    btnClass: 'btn-outline-success clickable',
                    action: () => {
                        let name = $('.groupNameInput').val();
                        if (!name) {
                            this.jconfirm.confirm({
                                title: 'Create group',
                                content: 'The name of the group cannot be empty.',
                                closeIcon: true,
                            });
                            return false;
                        }

                        this.utils.infoNotification('Creating group, please wait..');
                        this.httpHelper.post('sec/chat/create_group', {
                            name: name,
                        }).subscribe((response: any) => {
                            if (response.status) {
                                jcModal.close();
                                this.loadContacts();
                            } else {
                                this.utils.errorNotification(response.reason);
                            }
                        }, err => {
                            this.utils.errorNotification();
                        });
                        return false;
                    }
                },
                close: {
                    btnClass: 'btn-outline-secondary clickable',
                    action: () => {

                    }
                }
            }
        })
    }

    _openGroupInfo: boolean = false;

    openGroupInfo() {
        this._openGroupInfo = true;
    }
}

export interface Contact {
    contact_id?: string,
    contact_type?: string,
    name?: string,
    participants?: string,
    sub_name?: string,
    admin?: string,
}