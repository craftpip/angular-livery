<?php

use Fame\Auth\Users;
use Fame\Exception\UserException;
use Fuel\Core\DB;
use Fuel\Core\File;
use Fuel\Core\Input;

class Controller_Api_Sec_Chat extends Controller_Api_Authenticate {

    public function get_id() {
        echo \Fuel\Core\Session::key();
    }

    /**
     * Remove a participant from the group
     */
    public function post_remove_group_participant() {
        try {
            // this is group id, its counted as a contact in the users list.
            $contact_id = Input::json('contact.contact_id', false);
            $participant_id = Input::json('participant_id', false);

            if (!$contact_id or !$participant_id)
                throw new UserException('Missing parameters');

            $group = \Fame\ChatGroup::get_one([
                'chat_group_id' => $contact_id,
            ]);
            if (!$group)
                throw new UserException('The group does not exists, please try again');

            $participants = \Fame\Utils::_explodeAr($group['group_participants']);
            $pos = array_search($participant_id, $participants);

            if ($pos !== false) {
                $participants = array_splice($participants, $pos, 1);

                $af = \Fame\ChatGroup::update([
                    'chat_group_id' => $contact_id,
                ], [
                    'group_participants' => $participants,
                ]);
            }
            else {
                throw new UserException('The user does not exists in the group');
            }

            $updated_participants = \Fame\Utils::_implodeAr($participants);

            $r = [
                'status' => true,
                'data'   => [
                    'updated_participants' => $updated_participants,
                ],
            ];

        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    /**
     * Add participant to a group ? yes!
     */
    public function post_add_group_participant() {
        try {
            $contact_id = Input::json('contact.contact_id', false);
            $newParticipant = Input::json('new_participant', false);
            if (!$contact_id or !$newParticipant)
                throw new UserException('Missing parameters');

            $group = \Fame\ChatGroup::get_one([
                'chat_group_id' => $contact_id,
            ]);
            $currentParticipants = \Fame\Utils::_explodeAr($group['group_participants']);
            if (in_array($newParticipant, $currentParticipants)) {
                throw new UserException('The user is already in the group');
            }

            $currentParticipants[] = $newParticipant;

            \Fame\ChatGroup::update([
                'chat_group_id' => $contact_id,
            ], [
                'group_participants' => $currentParticipants,
            ]);

            $updatedParticipants = \Fame\Utils::_implodeAr($currentParticipants);

            $r = [
                'status' => true,
                'data'   => [
                    'updated_participants' => $updatedParticipants,
                ],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        $this->response($r);
    }

    /**
     * Why not change the group name?
     * everything is required.
     */
    public function post_change_group_name() {
        try {

            $contact_id = Input::json('contact_id', false);
            $name = Input::json('name', false);
            if (!$contact_id or !$name)
                throw new UserException('Missing parameters');

            $name = \Fuel\Core\Security::strip_tags($name);

            $af = \Fame\ChatGroup::update([
                'chat_group_id' => $contact_id,
            ], [
                'group_name' => $name,
            ]);

            $r = [
                'status' => true,
                'data'   => [],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    /**
     * @deprecated
     *            not required.
     *            the users list can be taken from the list api
     *             i guess
     *
     *            Currently the full list of contacts is stored on the client,
     *            that means getting a parsed list is useless and waste of time.
     */
    public function post_get_participants_group() {
        try {
            $contactId = Input::json('contact_id', false);
            if (!$contactId)
                throw new UserException('Missing parameters');


            $group = \Fame\ChatGroup::get_one([
                'chat_group_id' => $contactId,
            ]);
            if (!$group)
                throw new UserException('The group was not found');

            $participants = \Fame\Utils::_explodeAr($group['group_participants']);

            $users = [];

            foreach ($participants as $participant) {
                $user = Users::instance()
                    ->get_one([
                        'id' => $participant,
                    ]);
                $users[] = $user;
            }


            $r = [
                'status' => true,
                'data'   => [
                    'users' => $users,
                ],
            ];

        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    /**
     * Create a group because why not.
     * all u need is a name, the default participant is the person who creates it.
     */
    public function post_create_group() {
        try {
            $name = Input::json('name', false);
            if (!$name)
                throw new UserException('Missing parameters');

            $currentUser = $this->user_id;
            $participants = [$currentUser];

            $group_id = \Fame\ChatGroup::insert([
                'group_name'         => $name,
                'group_participants' => $participants,
                'group_created_by'   => $currentUser,
            ]);

            $r = [
                'status' => true,
                'data'   => [
                    'chat_group_id' => $group_id,
                ],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    /**
     * API to get list of inline attachment stuff
     * Only for chat.
     *
     * If u add sources to this, you'll have to add it to the compose function too, ofcourse its validated there.
     */
    public function post_search_attach() {
        try {
            $term = Input::json('term', false);
            if (!$term)
                throw new UserException('Missing parameters');

            $results = [];

            $ledgers = DB::query("
            select 
              ledger_mst.ledger_id,
              ledger_mst.ledger_name                                 
             from ledger_mst
            where (
              ledger_mst.ledger_id = '$term'
              or 
              ledger_mst.ledger_name like '%$term%'            
            )
            ")
                ->execute()
                ->as_array();


            foreach ($ledgers as $ledger) {
                $results[] = [
                    'type' => 'sheet',
                    'name' => $ledger['ledger_name'],
                    'id'   => $ledger['ledger_id'],
                ];
            }

            $ledgerFormats = DB::query("
            select 
              ledger_formats.ledger_f_id,
              ledger_formats.ledger_f_name                                
             from ledger_formats
            where (
              ledger_formats.ledger_f_id = '$term'
              or 
              ledger_formats.ledger_f_name like '%$term%'            
            )
            ")
                ->execute()
                ->as_array();


            foreach ($ledgerFormats as $format) {
                $results[] = [
                    'type' => 'mapping',
                    'name' => $format['ledger_f_name'],
                    'id'   => $format['ledger_f_id'],
                ];
            }


            $r = [
                'status' => true,
                'data'   => [
                    'list' => $results,
                ],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        $this->response($r);
    }

    /**
     * API to search in contacts.
     * used for global search listener.
     * @todo add group search as well! and name them accordingly.
     *       use the contacts view maybe ?
     *
     *       ok done
     */
    public function post_search_contacts() {
        try {
            $term = Input::json('term', false);

            $customer = Users::$customer;
            $currentUser = $this->user_id;

            $contacts = DB::query("
select *
from chat_contact_list
where (
          (chat_contact_list.contact_type = 'user' and chat_contact_list.contact_id != $currentUser)
            or
          (chat_contact_list.contact_type = 'group' and chat_contact_list.participants like '%$currentUser%')
          )
          and (chat_contact_list.name like '%$term%' 
          or 
          chat_contact_list.sub_name like '%term%')
order by chat_contact_list.name asc
            ")
                ->execute()
                ->as_array();

            //            $users = DB::query("
            //            select * from users
            //            where
            //            (
            //              users.id = '$term'
            //              or
            //              users.name like '%$term%'
            //              or
            //              users.username like '%$term%'
            //              or
            //              users.email like '%$term%'
            //            ) and
            //            users.group != '$customer'
            //            and users.id != '$currentUser'
            //            ")
            //                ->execute()
            //                ->as_array();

            $r = [
                'status' => true,
                'data'   => [
                    //                    'users' => $users,
                    'contacts' => $contacts,
                ],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    /**
     * @deprecated
     *
     *            was used for short polling for chats, it checked if new messages had arrived
     *            now we use firebase.
     *            good bye polling.
     */
    public function post_poll_new_chat() {
        try {

            $with = Input::json('user_id', false);
            $latest_chat_id = Input::json('latest_id', false);
            if (!$with or $latest_chat_id === false)
                throw new UserException('Missing parameter');

            $user_id = $this->user_id;

            $chats = DB::query("
            select 
             chat.*,
             users.username as from_user_username,
             users.name as from_user_name,
             users.group as from_user_group
             
             from chat as chat
            left join users as users
            on chat.from_user_id = users.id
            
            where (
              chat.participants like '%$with%'
              and 
              chat.participants like '%$user_id%'
            ) and 
            chat.chat_id > $latest_chat_id
            ")
                ->execute()
                ->as_array();


            $r = [
                'status' => true,
                'data'   => [
                    'chats' => $chats,
                ],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    /**
     * Get chat for contacts
     * @todo support groups
     */
    public function post_get_chats() {
        try {
            $contact = Input::json('contact', false);
            $contact_id = Input::json('contact.contact_id', false);
            $contact_type = Input::json('contact.contact_type', false);
            if (!$contact_id or !$contact_type)
                throw new UserException('Missing parameters');

            $user_id = $this->user_id;

            if ($contact_type == 'user') {
                $chats = DB::query("
                
                select 
                 *
                 from chat_list as chat
                where (
                  chat.participants like '%$contact_id%'
                  and 
                  chat.participants like '%$user_id%'
                )
                and chat.chat_group_id is null
                order by chat.chat_id desc                
                ")
                    ->execute()
                    ->as_array();
            }
            elseif ($contact_type == 'group') {
                $group = \Fame\ChatGroup::get_one([
                    'chat_group_id' => $contact_id,
                ]);
                if (!$group)
                    throw new UserException('Group was not found');

                $participants = \Fame\Utils::_explodeAr($group['group_participants']);

                $chats = DB::query("
                
                select 
                 *
                 from chat_list as chat
                where chat.chat_group_id = $contact_id
                order by chat.chat_id desc                
                ")
                    ->execute()
                    ->as_array();
            }
            else {
                throw new UserException('Invalid contact type: ' . $contact_type);
            }


            $r = [
                'status' => true,
                'data'   => [
                    'chats' => $chats,
                ],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    /**
     * Download a attachment that was sent with chat.
     *
     * @param $id
     */
    public function get_download_attachment($id) {
        $file = \Fame\Upload::getOne([
            'upload_id' => $id,
        ]);
        if (!$file) {
            echo 'the file does not exists';
            die;
        }

        $filePath = DOCROOT . $file['dir'] . DS . $file['path'];
        // check if the file exists first.
        if (!File::exists($filePath)) {
            echo 'The file you requested for download was not found on the server, it may have been removed. <br>Please request the sender to resend the attachment';
            die;
        }

        // direct download
        File::download($filePath, $file['original_name']);
    }

    public function post_compose() {
        try {

            $from = $this->user_id;
            $to = Input::json('to', false);
            $msg = Input::json('msg', false);
            $attachments = Input::json('attachments', []);
            $toContact = Input::json('toContact', false);
            $toContactId = Input::json('toContact.contact_id', false);
            $toContactType = Input::json('toContact.contact_type', false);

            if (!$toContactId or !$toContactType)
                throw new UserException('Missing parameters');

            $msg = \Fuel\Core\Security::strip_tags($msg);

            if (!$msg) {
                if (!count($attachments)) {
                    throw new UserException('Please enter a message');
                }
            }


            $variables = [];
            $matched = preg_match_all('(@[a-z]{1,}:[0-9]{1,})', $msg, $inlineLinks);
            if ($matched != 0) {
                foreach ($inlineLinks[0] as $inlineLink) {
                    $link = substr($inlineLink, 1);
                    list($type, $id) = explode(':', $link);
                    switch ($type) {
                        // auto complete part is here.
                        // sheets and mapping is removed from this template.
                        case 'sheet':
                            //                            $sheet = \Fame\Ledger\Ledger::get_one([
                            //                                'ledger_id' => $id,
                            //                            ]);
                            //                            if (!$sheet) {
                            //                                throw new UserException("The attached sheet $inlineLink was not found");
                            //                            }
                            //                            $name = $sheet['ledger_name'];
                            //                            $variables[] = [
                            //                                'replace' => $inlineLink,
                            //                                'name'    => $name,
                            //                                'id'      => $sheet['ledger_id'],
                            //                                'type'    => $type,
                            //                            ];
                            //                            break;
                        case 'mapping':
                            //                            $format = \Fame\Ledger\LedgerFormat::get_one([
                            //                                'ledger_f_id' => $id,
                            //                            ]);
                            //                            if (!$format) {
                            //                                throw new UserException("The attached mapping $inlineLink was not found");
                            //                            }
                            //                            $name = $format['ledger_f_name'];
                            //                            $variables[] = [
                            //                                'replace' => $inlineLink,
                            //                                'name'    => $name,
                            //                                'id'      => $format['ledger_f_id'],
                            //                                'type'    => $type,
                            //                            ];
                            //                            break;
                    }
                }
            }

            if ($toContactType == 'user') {
                // sending msg to a single user.
                $chat = $this->send_msg_to_user($from, $toContactId, $msg, $variables, $attachments);
            }
            else {
                $chat = $this->send_msg_to_group($from, $toContactId, $msg, $variables, $attachments);
            }

            $r = [
                'status' => true,
                'data'   => [
                    'chat' => $chat,
                ],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    private function send_msg_to_group($fromUserId, $toGroupId, $msg, $variables, $attachments) {
        $chatParticipants = \Fame\Utils::_implodeAr([]);
        $chat_id = \Fame\Chat::insert([
            'participants'  => $chatParticipants,
            'message'       => $msg,
            'from_user_id'  => $fromUserId,
            'variables'     => $variables,
            'attachments'   => $attachments,
            'chat_group_id' => $toGroupId,
        ]);

        $chats = DB::query("
                  select * from chat_list
                  where chat_list.chat_id = $chat_id                
                ")
            ->execute()
            ->as_array();

        $chat = (count($chats)) ? $chats[0] : [];

        $group = \Fame\ChatGroup::get_one([
            'chat_group_id' => $toGroupId,
        ]);
        if (!$group)
            throw new UserException('The group does not exists');

        $participants = \Fame\Utils::_explodeAr($group['group_participants']);

        foreach ($participants as $participant) {
            /**
             * Group chat, send the chat to all of the participants.
             * Im typing participants so many times, -_-
             */
            $firebase = new \Fame\Firebase();
            $toRef = $firebase->database()
                ->getReference('chats' . "/$participant");

            $toChat = $chat;
            $toChat['chat_contact_id'] = $toGroupId;
            $toChat['created_at'] = (int)$toChat['created_at'];
            $toChat['chat_contact_name'] = $group['group_name'];
            // send to the sender
            $toRef->push($toChat);
        }

        return $chat;
    }

    private function send_msg_to_user($fromUserId, $toUserId, $msg, $variables, $attachments) {
        $participants = \Fame\Utils::_implodeAr([
            $fromUserId,
            $toUserId,
        ]);

        $chat_id = \Fame\Chat::insert([
            'participants' => $participants,
            'message'      => $msg,
            'from_user_id' => $fromUserId,
            'variables'    => $variables,
            'attachments'  => $attachments,
        ]);


        $chats = DB::query("
                  select * from chat_list
                  where chat_list.chat_id = $chat_id                
                ")
            ->execute()
            ->as_array();

        $chat = (count($chats)) ? $chats[0] : [];

        /*
         * okay chat was sent, but now send to thru firebase.
         * To entries , in the senders chat list and in the receivers chat list.
         */
        $firebase = new \Fame\Firebase();
        $toRef = $firebase->database()
            ->getReference('chats' . "/$toUserId");

        $toChat = $chat;
        $toChat['chat_contact_id'] = $fromUserId; // used to group chats
        // when received by the client, it will sort it out using this id
        /**
         * Have to convert this to INT, firebase uses it for indexing.
         */
        $toChat['created_at'] = (int)$toChat['created_at'];
        $toChat['chat_contact_name'] = \Fame\Auth\Auth::instance($fromUserId)
            ->get_property('name');
        // send to the sender
        $toRef->push($toChat);

        $fromRef = $firebase->database()
            ->getReference('chats' . "/$fromUserId");
        $fromChat = $chat;
        $fromChat['chat_contact_id'] = $toUserId;
        $fromChat['created_at'] = (int)$fromChat['created_at'];
        $fromChat['chat_contact_name'] = \Fame\Auth\Auth::instance($toUserId)
            ->get_property('name');
        $fromRef->push($fromChat);

        return $chat;
    }
    
    public function post_contacts() {
        try {
            $currentUser = $this->user_id;

            $q = "
            select * from chat_contact_list
            where (
              (chat_contact_list.contact_type = 'user') 
              or 
              (chat_contact_list.contact_type = 'group' and chat_contact_list.participants like '%$currentUser%')
            )
            order by chat_contact_list.name asc
            ";

            $contacts = DB::query($q)
                ->execute()
                ->as_array();


            foreach ($contacts as $k => $item) {
                if ($item['contact_type'] == 'group') {
                    $participants = [];
                    $howMany = 2;
                    $totalPars = \Fame\Utils::_explodeAr($item['participants']);
                    foreach ($totalPars as $item2) {
                        $name = \Fame\Auth\Auth::instance($item2)
                            ->get_property('name');
                        $participants[] = $name;
                        $howMany -= 1;
                        if (!$howMany)
                            break;
                    }

                    $contacts[$k]['sub_name'] = join(', ', $participants);
                    if (count($participants) < count($totalPars)) {
                        $contacts[$k]['sub_name'] .= ' & ' . (count($totalPars) - count($participants)) . ' more';
                    }
                }
            }


            $r = [
                'status' => true,
                'data'   => [
                    'contacts' => $contacts,
                ],
            ];

        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    /**
     * Get list of users that the logged in usere can chat with
     */
    public function post_users() {
        try {
            $adminUsers = Users::instance()
                ->get([
                    [
                        'group',
                        '!=',
                        Users::$customer,
                    ],
                ]);

            if (!$adminUsers)
                $adminUsers = [];

            $r = [
                'status' => true,
                'data'   => [
                    'users' => $adminUsers,
                ],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

}