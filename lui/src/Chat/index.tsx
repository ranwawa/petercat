import type {
  ChatItemProps,
  ChatMessage,
  MetaData,
  ProChatInstance,
} from '@ant-design/pro-chat';
import { ProChat } from '@ant-design/pro-chat';
import { Markdown } from '@ant-design/pro-editor';
import React, { ReactNode, memo, useRef, useState, type FC } from 'react';
import StopBtn from '../StopBtn';
import { theme } from '../Theme';
import ThoughtChain from '../ThoughtChain';
import { Role } from '../interface';
import { BOT_INFO } from '../mock';
import { streamChat } from '../services/ChatController';
import { handleStream } from '../utils';
import Actions from './inputArea/actions';
import '../style/global.css';

const { getDesignToken } = theme;
const globalToken = getDesignToken();

export interface ChatProps {
  assistantMeta?: MetaData;
  helloMessage?: string;
  apiUrl?: string;
  drawerWidth?: number;
  suggested_questions?: string[];
}

const Chat: FC<ChatProps> = memo(({ helloMessage, apiUrl, drawerWidth, assistantMeta, suggested_questions }) => {
  const proChatRef = useRef<ProChatInstance>();
  const [chats, setChats] = useState<ChatMessage<Record<string, any>>[]>();
  const messageMinWidth = drawerWidth
    ? `calc(${drawerWidth}px - 90px)`
    : '100%';
  return (
    <div className="petercat-lui" style={{ height: '100%' }}>
      <div
        className="h-full w-full"
        style={{ backgroundColor: globalToken.chatBoxBackgroundColor }}
      >
        <ProChat
          showTitle
          chats={chats}
          onChatsChange={(chats) => {
            setChats(chats);
          }}
          chatRef={proChatRef}
          helloMessage={helloMessage || BOT_INFO.work_info.prologue}
          userMeta={{ title: 'User' }}
          chatItemRenderConfig={{
            avatarRender: (props: ChatItemProps) => {
              if (props.originData?.role === Role.user) {
                return <></>;
              }
              if (
                props.originData?.role === Role.tool ||
                props.originData?.role === Role.knowledge
              ) {
                return <div className="w-[40px] h-[40px]" />;
              }
            },
            contentRender: (props: ChatItemProps, defaultDom: ReactNode) => {
              const originData = props.originData || {};
              if (originData?.role === Role.user) {
                return defaultDom;
              }
              const message = originData.content;
              const defaultMessageContent = (
                <div className="leftMessageContent" style={{minWidth: messageMinWidth }}>{defaultDom}</div>
              );

              if (!message || !message.includes('<TOOL>')) {
                return defaultMessageContent;
              }

              const [toolStr, answerStr] = message.split('<ANSWER>');
              const tools = toolStr.split('\n').filter(Boolean);
              const lastTool = tools[tools.length - 1];

              const regex = /<TOOL>(.*)/;
              const match = lastTool.match(regex);

              if (!match) {
                console.error('No valid JSON found in input');
                return defaultMessageContent;
              }

              try {
                const config = JSON.parse(match[1]);
                const { type, extra } = config;

                if (![Role.knowledge, Role.tool].includes(type)) {
                  return defaultMessageContent;
                }

                const { status, source } = extra;

                return (
                  <div
                    className="p-2 bg-white rounded-md "
                    style={{ minWidth: messageMinWidth }}
                  >
                    <div className="mb-1">
                      <ThoughtChain
                        content={extra}
                        status={status}
                        source={source}
                      />
                    </div>
                    <Markdown style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                      {answerStr}
                    </Markdown>
                  </div>
                );
              } catch (error) {
                console.error(`JSON parse error: ${error}`);
                return defaultMessageContent;
              }
            },
          }}
          assistantMeta={{
            avatar: assistantMeta?.avatar || BOT_INFO.avatar ,
            title: assistantMeta?.title || BOT_INFO.resourceName,
            backgroundColor: assistantMeta?.backgroundColor
          }}
          autocompleteRequest={async (value) => {
            if (value === '/') {
             const questions = suggested_questions ?? BOT_INFO.work_info.suggested_questions
              return questions.map(
                (question: string) => ({
                  value: question,
                  label: question,
                }),
              );
            }
            return [];
          }}
          request={async (messages) => {
            const newMessages = messages
              .filter(
                (item) => item.role !== Role.tool && item.role !== Role.knowledge,
              )
              .map((message) => ({
                role: message.role,
                content: message.content as string,
              }));

            const response = await streamChat(newMessages, apiUrl);
            return handleStream(response);
          }}
          inputAreaProps={{ className: 'userInputBox h-24 !important' }}
          actions={{
            render: () => [
              <StopBtn
                key="StopBtn"
                visible={!!proChatRef?.current?.getChatLoadingId()}
                action={() => proChatRef?.current?.stopGenerateMessage()}
              />,
              <Actions key="Actions"></Actions>,
            ],
            flexConfig: {
              gap: 24,
              direction: 'vertical',
              justify: 'space-between',
            },
          }}
      />
    </div>
    </div>
   
  );
});

export default Chat;
