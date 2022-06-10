import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FireBaseQeustions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {
        authorId:string
    }>
}>


type QuestionType = {
    id: string;
    author: {
     name: string;
     avatar: string;
     }
     content: string;
     isAnswered: boolean;
     isHighLighted: boolean;
     likeCount: number;
     likeId: string | undefined
 }


export function useRoom(roomId: string | undefined){
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    const { user } = useAuth();

    useEffect(()=> {
        const roomRef = ref(database, `rooms/${roomId}`)

        onValue(roomRef, (room)=> {
            
            const databaseRoom = room.val()
            const firebaseQuestions: FireBaseQeustions = databaseRoom?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value])=>{
                 return {
                     id: key,
                     content: value.content,
                     author: value.author,
                     isHighLighted: value.isHighLighted,
                     isAnswered: value.isAnswered,
                     likeCount: Object.values(value.likes ?? {}).length,
                     likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                 }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions)
        })

    }, [roomId, user?.id])

    return {questions, title}
}