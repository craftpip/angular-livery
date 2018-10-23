import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {HttpHelper, SearchService, Utils} from "../../shared/helper.service";
import {JConfirm} from "../../shared/jconfirm";
import {AuthService} from "../../shared/auth/auth.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {Contact} from "../chat.component";

declare var $: any;

@Component({
    selector: 'app-chat-group-info',
    templateUrl: './chat-group-info.component.html',
})

export class ChatGroupInfoComponent implements OnDestroy, AfterViewInit {

    @Input('contactList') contactList: Contact[] = [];
    @Input('contact') contact: Contact;
    public participantCount: number = 0;
    public participantIds: any[] = [];
    public participantContacts: Contact[] = [];
    public addParticipantDropdown: any[] = [];
    public user: any = {};

    constructor(
        public httpHelper: HttpHelper,
        public jconfirm: JConfirm,
        public fb: FormBuilder,
        public router: Router,
        public authService: AuthService,
        public utils: Utils,
        public searchService: SearchService,
        public changeDetector: ChangeDetectorRef,
    ) {

    }

    editName: boolean = false;
    editNameValue: string = '';
    editNameSaving: boolean = false;

    ngAfterViewInit() {
        this.parseParticipants(this.contact.participants);
        // let rawP = this.contact.participants.split('-');
        this.editNameValue = this.contact.name;
        // let participants = rawP.slice(1, rawP.length - 1);
        // this.participantIds = participants;
        // this.participantCount = participants.length;
        // this.loadParticipants();
        this.changeDetector.detectChanges();

        // let participantContacts = this.contactList.filter((a) => {
        //     return (participants.indexOf(a.contact_id) != -1);
        // });
        // this.participantContacts = participantContacts;

        this.addParticipantDropdown = this.contactList.filter((contact) => {
            return contact.contact_type == 'user';
        }).map((contact) => {
            return {
                'name': contact.name,
                'code': contact.contact_id,
            }
        });
        this.user = this.authService.getUser();
    }

    parseParticipants(participantStr: string) {
        let rawP = participantStr.split('-');
        let participants = rawP.slice(1, rawP.length - 1);
        this.participantIds = participants;
        this.participantCount = participants.length;

        let participantContacts = this.contactList.filter((a) => {
            return (participants.indexOf(a.contact_id) != -1);
        });
        this.participantContacts = participantContacts;
    }

    addParticipantSelection: any = null;

    _showAddParticipant: boolean = false;

    addParticipantShow() {
        this._showAddParticipant = true;
        this.addParticipantSelection = null;
    }

    /**
     * Remove him!
     * @param contact_id
     */
    removeParticipant(contact_id) {
        this.jconfirm.confirm({
            title: "Remove participant?",
            content: `Are you sure to remove the participant from the group? 
                However the chats sent by the user will not be deleted.
                `,
            buttons: {
                remove: {
                    text: "Remove",
                    btnClass: 'btn btn-outline-danger',
                    action: () => {
                        this.utils.infoNotification('Please wait, removing participant');
                        this.httpHelper.post('sec/chat/remove_group_participant', {
                            contact: this.contact,
                            participant_id: contact_id,
                        }).subscribe((response: any) => {
                            if (response.status) {
                                this.utils.successNotification('Successfully removed the participant');
                                let updatedParticipants = response.data.updated_participants;
                                this.contact.participants = updatedParticipants;
                                this.parseParticipants(updatedParticipants);
                            } else {
                                this.utils.errorNotification(response.reason);
                            }
                        }, err => {
                            this.utils.errorNotification();
                        })
                    }
                },
                close: {
                    action: () => {

                    }
                }
            }
        })
    }

    addingNewParticipant: boolean = false;

    addNewParticipant() {
        this.addingNewParticipant = true;
        this.httpHelper.post('sec/chat/add_group_participant', {
            contact: this.contact,
            new_participant: this.addParticipantSelection.code
        }).subscribe((response: any) => {
            this.addingNewParticipant = false;
            if (response.status) {
                let updatedParticipants = response.data.updated_participants;
                this.contact.participants = updatedParticipants;
                this.parseParticipants(updatedParticipants);
                this.addParticipantSelection = null;
                this._showAddParticipant = false;
                this.utils.successNotification('Participant added successfully');
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.addingNewParticipant = false;
            this.utils.errorNotification();
        });
    }

    deleteGroup() {
        this.jconfirm.confirm({
            title: 'Delete group',
            content: `
            Are you sure to delete the group, <br>
            All chats in the group will be deleted.
            `,
            autoClose: 'close|4000',
            buttons: {
                delete: {
                    btnClass: 'btn-outline-danger clickable',
                    action: () => {

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

    saveName() {
        this.editNameSaving = true;
        this.httpHelper.post('sec/chat/change_group_name', {
            contact_id: this.contact.contact_id,
            name: this.editNameValue,
        }).subscribe((response: any) => {
            this.editNameSaving = false;
            if (response.status) {
                this.contact.name = this.editNameValue;
                this.editName = false;
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.editNameSaving = false;
            this.utils.errorNotification();
        })
    }

    startEditName() {
        this.editName = true;
        setTimeout(() => {
            $('#chat-edit-name').focus();
        }, 100);
    }

    loadingParticipants: boolean = false;

    loadParticipants() {
        this.loadingParticipants = true;
        // this.httpHelper.post('sec/')
    }


    ngOnDestroy() {
    }

}