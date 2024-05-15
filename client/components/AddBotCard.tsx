'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { Card, Image, CardBody, CardFooter } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { AddBotIcon } from "../app/icon/addboticon";

declare type Bot = Tables<'bots'>;

const BotCard = () => {
  const router = useRouter();

  return (
    <Card
      className="border-none w-[316px] h-[400px] bg-[#FFF] rounded-[16px] p-2"
      shadow="sm"
      isPressable
      onPress={() => router.push(`/chat/add`)}
    >
      <CardBody className="overflow-visible p-0 bg-[#F3F4F6] h-[400px] flex justify-center items-center">
        <AddBotIcon className="" />

      </CardBody>
    </Card>
  );
};

export default BotCard;
