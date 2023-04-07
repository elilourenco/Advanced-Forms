import { useState } from 'react'
import './styles/global.css'
import {useForm , useFieldArray} from 'react-hook-form';
import {  z } from "zod";
import { zodResolver} from "@hookform/resolvers/zod"
import {supabase} from './lib/supabase';

const createUserFormSchema = z.object({

  avatar: z.instanceof(FileList).transform(List =>List.item(0)!)
  .refine(file => file.size <= 5 * 1024 * 1024 , 'The file needed about of the 5MB')
  ,
  name: z.string().nonempty('the name is obrigatory')
  .transform( name=>{
    return name.trim().split(' ').map(word =>{
      return word[0].toLocaleUpperCase().concat(word.substring(1))
    }).join(' ')
  }),
  email: z.string()
  .nonempty('The email is obrigatory')
  .email('The format of the email is invalid')
  .toLowerCase()
  .refine(email =>{
    return email.endsWith('@gmail.com')
  }, 'the email needed on the google'),
  
  password: z.string()
  .min(6,'The password needed about the six charecters'),
  techs:  z.array(z.object({
    title : z.string().nonempty('The title is obrigatory'),
    knowledge: z.coerce.number().min(1).max(100),
  })).min(2,'Adicion about two tecnologs')
  .refine(techs =>{
    return techs.some(tech =>tech.knowledge >50)
  }, 'You are learning'),
   


})


type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const [output, setOutput] = useState('')

  const {register, handleSubmit,formState:{errors} , control
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })



  const { fields, append ,remove } = useFieldArray({
    control,
    name: 'techs',
  })


  function addNewTech( ){
    append({title: '', knowledge:0})

  }
 


   async function createUser(data:any){

    await supabase.storage.from('react-form').upload(
      'data.avatar.name, data.avatar')




    setOutput(JSON.stringify(data,null,2))
   

  }
  

  return (
    <main className='h-screen bg-zinc-900 text-zinc-300 flex flex-col gap-10 items-center justify-center'>
      <form 
      onSubmit={handleSubmit(createUser)}
      className='flex flex-col gap-4 w-full max-w-xs'>

        <div className='flex flex-col gap-1'>
          <label htmlFor='avatar'>Avatar</label>
          <input
             
            type='file'
            accept='image/*'
             

            {...register('avatar')}
           />
           {errors.avatar &&  <span>{errors.avatar.message}</span>}

        </div>
       
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


        <div className='flex flex-col gap-1'>
      
          
          <label htmlFor="" className='flex items-center justify-between'>
            Tecnologias
            <button type='button'  onClick={addNewTech} className='text-rose-500 text-xs'>
              Adicionar</button>
          </label>
          
          {fields.map((field, index) =>{
          
            return(
              <div key={field.id} className='flex gap-2'>
                 <div className='flex  flex-1 flex-col gap-1'>

                    <input
                      className=' border border-rose-200 shadow-sm rounded h-10 px-3 bg-zinc-600 text-white' 
                      type="text" 
                      {...register(`techs.${index}.title`)} 
                    />
                    {errors.techs?.[index]?.title &&  <span className='text-red-500 text-sm'>{errors.techs?.[index]?.title.message}</span>}
                  </div>
                  <div className='flex   flex-col gap-1'>

                   <input
                      className='w-16  border border-rose-200 shadow-sm rounded h-10 px-3 bg-zinc-600 text-white' 
                      type="number" 
                      {...register(`techs.${index}.knowledge`)} 

              
                    />

                    {errors.techs?.[index]?.knowledge &&  <span className='text-red-500 text-sm'>{errors.techs?.[index]?.knowledge.message}</span>}

                  </div>
                </div>

            )
          })}

          {errors.techs &&  <span className='text-red-500 text-sm'>{errors.techs.message}</span>}
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
