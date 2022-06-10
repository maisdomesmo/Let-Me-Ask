import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

//import uuid from 'react-native-uuid';
import '.././styles/auth.scss'
import { Button } from '../components/Button'
import { database } from '../services/firebase'
import { child, push, ref, set} from 'firebase/database'
import { useAuth } from '../hooks/useAuth'

export function NewRoom() {
   const {user} = useAuth()
   const navigate = useNavigate() 

    const [newRoom, setNewRoom] = useState('')

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();

        if (newRoom.trim() === ''){
            return;
        }

        //const uid = uuid.v4()
        //const time = new Date()

        //let id = `${newRoom}${time.getHours()}${time.getSeconds()}${time.getMilliseconds()}`
        
        
        const newKey = push(child(ref(database), 'rooms')).key
        
        const roomRef = ref(database, 'rooms/' + newKey )

         await set(roomRef, {
            title: newRoom,
            authorId: user?.id,
        }) 
        navigate(`/rooms/${roomRef.key}`)
        /* await get(child(roomRef, 'key'))
        .then((key)=>{
            if(key.exists()){
                    
                
            navigate(`/rooms/${key.val()}`)
            }
        })
         */
        
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
                
                <h2>Criar uma nova sala</h2>

                <form onSubmit={handleCreateRoom} >
                    <input 
                    type="text"
                    placeholder='Nome da sala'
                    onChange={event => setNewRoom(event.target.value)}
                    value={newRoom}
                     />
                     <Button type='submit'>Criar sala</Button>
                </form>
                <p>
                    Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                </p>

            </main>

        </div>
    )
}