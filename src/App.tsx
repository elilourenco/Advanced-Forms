import { useState } from 'react'
import './styles/global.css'
import {useForm} from 'react-hook-form';
import { TypeOf, z } from "zod";
import { zodResolver} from "@hookform/resolvers/zod"

const createUserFormSchema = z.object({
  name: z.string().nonempty('the name is obrigatory')
  .transform( name=>{
    return name.trim().split('').map(word =>{
      return word[0].toLocaleLowerCase().concat(word.substring(1))
    })
  }),
  email: z.string()
  .nonempty('The email is obrigatory')
  .email('The format of the email is invalid')
  .toLowerCase(),
  password: z.string().min(6,'The password needed about the six charecters'),
})


type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const [output, setOutput] = useState('')

  const {register, handleSubmit,formState:{errors} 
} = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  
 


  function createUser(data:any){
    setOutput(JSON.stringify(data,null,2))
   

  }
  

  return (
    <main className='h-screen bg-zinc-900 text-zinc-300 flex flex-col gap-10 items-center justify-center'>
      <form 
      onSubmit={handleSubmit(createUser)}
      className='flex flex-col gap-4 w-full max-w-xs'>
       
       <div className='flex flex-col gap-1'>
          <label htmlFor='name'>Name</label>
          <input
             className='border border-rose-200 shadow-sm rounded h-10 px-3  bg-zinc-600 text-white'
            type='text'
             

            {...register('name')}
           />
           {errors.name &&  <span>{errors.name.message}</span>}

        </div>


        <div className='flex flex-col gap-1'>
          <label htmlFor='email'>E-mail</label>
          <input
             className='border border-rose-200 shadow-sm rounded h-10 px-3  bg-zinc-600 text-white'
            type='email'
             

            {...register('email')}
           />
           {errors.email &&  <span>{errors.email.message}</span>}

        </div>

        <div className='flex flex-col gap-1'>
      
          
          <label htmlFor="password">Password</label>
          <input
           className='border border-rose-200 shadow-sm rounded h-10 px-3 bg-zinc-600 text-white' 
          type="password" 
          {...register('password')} />

          {errors.password &&  <span>{errors.password.message}</span>}

        </div>
        <button 
        type="submit"
        className='bg-rose-400 rounded font-semibold text-white h-10 hover:bg-rose-500'>
          To salve
        </button>

      </form>
      <pre>{output}</pre>

    </main>
  )
}

export default App
