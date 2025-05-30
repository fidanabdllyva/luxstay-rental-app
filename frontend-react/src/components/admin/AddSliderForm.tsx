import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createSlider } from '@/api/requests/slider'
// import { toast } from 'sonner'
import { useState } from 'react'
import { uploadFile } from '@/api/requests/cloudinaryUpload'
import { Label } from '@/src/components/ui/label'

type Props = {
    onSuccess: () => void
}

const SliderSchema = Yup.object().shape({
    title: Yup.string().min(2, 'Too short').required('Required'),
    page: Yup.string().required('Required'),
    imageURL: Yup.string().url().required('Image is required'),
})

const AddSliderForm = ({ onSuccess }: Props) => {
    const [preview, setPreview] = useState('')

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await uploadFile(formData)
            setFieldValue('imageURL', res.url)
            setPreview(res.url)
            //   toast.success('Image uploaded')
        } catch {
            //   toast.error('Upload failed')
        }
    }

    return (
        <Formik
            initialValues={{ title: '', page: '', imageURL: '' }}
            validationSchema={SliderSchema}
            onSubmit={async (values, { resetForm }) => {
                try {
                    await createSlider(values)
                    //   toast.success('Slider added successfully')
                    resetForm()
                    setPreview('')
                    onSuccess()
                } catch {
                    //   toast.error('Failed to add slider')
                }
            }}
        >
            {({ errors, touched, setFieldValue }) => (
                <Form className="space-y-4">
                    <div>
                        <Label htmlFor='title' className='mb-2'>Title</Label>
                        <Field name="title" as={Input} />
                        {errors.title && touched.title && (
                            <p className="text-sm text-red-500">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="page" className='mb-2'>Page</Label>
                        <Field name="page" as="select" className="w-full border rounded px-3 py-2">
                            <option value="">Select Page</option>
                            <option value="home">home</option>
                            <option value="about">about</option>
                        </Field>
                    </div>

                    <div>
                        <Label className='mb-2'>Image</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, setFieldValue)}
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="mt-2 w-full h-[150px] object-cover rounded"
                            />
                        )}
                        {errors.imageURL && touched.imageURL && (
                            <p className="text-sm text-red-500">{errors.imageURL}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full">
                        Add Slider
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default AddSliderForm
