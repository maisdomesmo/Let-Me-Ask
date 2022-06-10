import logoimg from '../assets/images/logo.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { Button } from '../components/Button'

import deleteImg from '../assets/images/delete.svg'
import { useNavigate, useParams } from 'react-router-dom'
import '.././styles/room.scss'
import { RoomCode } from '../components/RoomCode'
/* import { useAuth } from '../hooks/useAuth' */
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import { ref, remove, update } from 'firebase/database'
import { database } from '../services/firebase'
import { async } from '@firebase/util'

type RoomParams = {
    id: string
}



export function AdminRoom(){
    //const {user} = useAuth()
    const navigate = useNavigate()
    const params = useParams<RoomParams>();
    const roomId = params.id
    const {title, questions} = useRoom(roomId)

    async function handleEndRoom(){
       const roomRef = ref(database, `rooms/${roomId}`)
        await update(roomRef, {
           endendAt: new Date()
       })
       navigate('/')
    }

    async function handleCheckQuestionAsAnswered (questionId: string){
        const questionRef = ref(database, `rooms/${roomId}/${questionId}`)
           await update(questionRef, {
            isAnswered: true
           })   
    }

    async function handleHighLightQuestion (questionId: string){
        const questionRef = ref(database, `rooms/${roomId}/${questionId}`)
           await update(questionRef, {
            isHighLighted: true
           }) 
    }

    async function  handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que deseja excluir esta pergunta?')){
           const questionRef = ref(database, `rooms/${roomId}/${questionId}`)
           await remove(questionRef)   
        }
    }

    return (
        <div id='page-room'>
            <header>
                <div className="content">
                    <img src={logoimg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
                    </div>
                
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>

                <div className="question-list">
                    {questions.map(question =>{
                        if(question.author !== undefined){
                            return (
                                <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighLighted}
                                >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type='button'
                                            onClick={()=> handleCheckQuestionAsAnswered(question.id)}
                                            >
                                                <img src={checkImg} alt='marcar pergunta como respondida'/>
                                        </button>

                                        <button
                                            type='button'
                                            onClick={()=> handleHighLightQuestion(question.id)}
                                            >
                                                <img src={answerImg} alt='dar destaque à pergunta'/>
                                        </button>
                                    </>
                                )}

                                <button
                                    type='button'
                                    onClick={()=> handleDeleteQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt='remover pergunta'/>
                                </button>
                                
                                
                                </Question>
                            )
                        } else {
                            return
                        }
                    })}
                </div>
            </main>
        </div>
    )
}