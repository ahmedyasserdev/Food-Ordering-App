'use client'
import { InputTypes, Routes, UserRole } from '@/constants/enums';
import { useFormFields } from '@/hooks/useFormFields';
import { IFormField, Translations } from '@/types'
import { Session } from 'next-auth';
import Image from 'next/image';
import React, { useActionState, useEffect, useState } from 'react'
import FormFields from './form-fields/FormFields';
import Loader from './Loader';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import Checkbox from './form-fields/Checkbox';
import { ValidationErrors } from '@/validations/auth';
import { updateProfile } from '@/server/actions/profile.actions';
import {motion} from "motion/react"
import { CameraIcon } from 'lucide-react'
import toast from 'react-hot-toast';

type EditUserFormProps = {
    translations: Translations;
    user: Session['user']
}



const EditUserForm = ({ translations, user }: EditUserFormProps) => {

  const formData = new FormData();

    Object.entries(user).forEach(([key,value]) =>{
      if (value !== null && value !== undefined && key !== 'image') {
        formData.append(key , value.toString());

      }
    })

  const initialState: {
      message?: string;
      error?: ValidationErrors;
      status?: number | null;
      formData?: FormData | null;
    } = {
      message: "",
      error: {},
      status: null,
      formData
    };
  

    const {getFormFields} = useFormFields({slug : Routes.PROFILE, translations });
    const session = useSession();
    const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);
      const [state , action ,pending] = useActionState(updateProfile.bind(null,isAdmin), initialState);
      const [selectedImage, setSelectedImage] = useState(user.image ?? "");


      useEffect(() => {
        if (state.message && state.status && !pending) {
          toast.success(state.message,{icon : state.status === 200 ? "✅" : "❌"});
        }
      }, [pending, state.message, state.status]);
    
      useEffect(() => {
        setSelectedImage(user.image as string);
      }, [user.image]);


    return (
        <form className='flex flex-col md:flex-row gap-10' action={action}>
            <div className="group relative  size-[200px] overflow-hidden rounded-full mx-auto">
            {selectedImage && (
          <Image
            src={selectedImage}
            alt={user.name}
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        )}

            <div
          className={`${
            selectedImage
              ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
              : ""
          } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
        >
          <UploadImage setSelectedImage={setSelectedImage}/>
        </div>
            </div>

            <div className="flex-1">
            {getFormFields().map((field: IFormField , index : number) => {
          const fieldValue = state?.formData?.get(field.name) ?? formData.get(field.name);
          return (
            <motion.div key={field.name} className="mb-3"
              initial = {{
               opacity : 0,
               visibility : 'hidden'
              }}
                animate = {{
                  opacity : 1 ,
                  visibility : 'visible'
                }}
                transition={{
                  delay : 0.2 * index ,
                  ease : 'easeIn'
                }}
            >
              <FormFields
                {...field}
                defaultValue={fieldValue as string}
                error={state?.error}
                readOnly={field.type === InputTypes.EMAIL}
              />
            </motion.div>
          );
        })}

{user.role === UserRole.ADMIN && (
          <div className="flex items-center gap-2 my-4">
            <Checkbox
              name="admin"
              checked={isAdmin}
              onClick={() => setIsAdmin(!isAdmin)}
              label="Admin"
            />
          </div>
        )}




<Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Loader /> : translations.save}
        </Button>
            </div>

        </form>
    )
}

export default EditUserForm




const UploadImage = ({
  setSelectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
      />
      <label
        htmlFor="image-upload"
        className="border rounded-full size-[200px] flex-center cursor-pointer"
      >
        <CameraIcon className="!w-8 !h-8 text-accent" />
      </label>
    </>
  );
};