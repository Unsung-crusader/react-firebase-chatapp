import * as React from 'react';
import { format } from 'date-fns';
import { Timestamp, CollectionReference } from '@firebase/firestore-types';

import { useCollection, useDoc } from '../../../hooks';

type MessageType = {
  id: string;
  text: string;
  createdAt: Timestamp;
  user: CollectionReference;
};

export default function ChatMessages() {
  const messages: MessageType[] | null = useCollection(
    `channels/cricket/messages`,
    `createdAt`
  );

  return (
    <div className="px-6 py-4 flex-1 overflow-y-scroll">
      {messages &&
        messages.map((message: MessageType, idx) => {
          const prevMessage = messages[idx - 1];
          const showAvatar =
            !prevMessage || prevMessage.user.id !== message.user.id;

          if (showAvatar) {
            return (
              <div className="flex items-start mb-4 text-sm">
                <Message message={message} />
              </div>
            );
          }

          return (
            <div className="text-sm">
              <p className="text-black leading-normal">{message.text}</p>
            </div>
          );
        })}
    </div>
  );
}

type MessageProps = {
  message: MessageType;
};

type Author = {
  email: string;
  id: string;
  name: string;
  photo: string;
};

function Message(props: MessageProps) {
  const { message } = props;
  const { id, createdAt, text, user } = message;
  const author = useDoc(user.path);

  return (
    <>
      {author ? (
        <img
          className="w-10 h-10 rounded mr-3"
          style={{
            backgroundImage: `url(${author.photo})`,
            backgroundSize: 'cover',
            borderRadius: 3,
          }}
        />
      ) : null}
      <div className="flex-1 overflow-hidden">
        <span className="font-bold">{author && author.name} </span>
        <span className="text-grey text-xs">
          {format(createdAt.toDate(), 'HH:mm A')}
        </span>
        <p className="text-black leading-normal" style={{ paddingTop: 2.5 }}>
          {text}
        </p>
      </div>
    </>
  );
}