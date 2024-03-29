import { useNavigate } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'


import '.././styles/auth.scss'
import { Button } from '../components/Button'

import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'
import { ref, get } from 'firebase/database'

export function Home() {
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function handleCreateRoom(){
        if (!user){
            await signInWithGoogle()
        }

        navigate('/rooms/new')    
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault()

        if (roomCode.trim() === ''){
            return
        }

        const roomRef = ref(database, `rooms/${roomCode}`)
        await get(roomRef).then((room)=>{
            if(!room.exists()){
                alert('Room does not exists')
                return
            }

            if(room.val().endendAt){
                alert('Room already closed')
                return
            }
            
            navigate( `rooms/${roomCode}`)

        }) 
         
         

    }
    

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real.</p>
            </aside>

            <main className='main-content'>
                <div >
                    <img src={logoImg} alt="Letmeask" />
                </div>
                <button onClick={handleCreateRoom} className='create-room'>
                    <img src={googleIconImg} alt="Logo do Google" />
                    Crie sua sala com o Goole
                </button>
                <div className='separator'>ou entre em uma sala</div>

                <form onSubmit={handleJoinRoom}>
                    <input 
                    type="text"
                    placeholder='Digite o código da sala'
                    onChange={event => setRoomCode(event.target.value)}
                    value={roomCode}
                    
                     />
                     <Button type='submit'>Entrar na sala</Button>
                </form>

            </main>

        </div>
    )
}