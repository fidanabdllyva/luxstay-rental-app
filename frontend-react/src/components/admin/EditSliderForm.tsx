import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateSlider } from '@/api/requests/slider'
// import { toast } from 'sonner'
import { useState } from 'react'
import type { Slide } from '@/types/slider'
import { uploadFile } from '@/api/requests/cloudinaryUpload'
import { Label } from '@/src/components/ui/label'

type Props = {
    slider: Slide
    onSuccess: () => void
}

const SliderSchema = Yup.object().shape({
    title: Yup.string().min(2).required(),
    page: Yup.string().required(),
    imageURL: Yup.string().url().required(),
})

const EditSliderForm = ({ slider, onSuccess }: Props) => {
    const [preview, setPreview] = useState(slider.imageURL)

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
            //   toast.error('Image upload failed')
        }
    }

    return (
        <Formik
            initialValues={{
                title: slider.title,
                page: slider.page,
                imageURL: slider.imageURL,
            }}
            validationSchema={SliderSchema}
            onSubmit={async (values) => {
                try {
                    await updateSlider(slider.id, values)
                    //   toast.success('Slider updated')
                    onSuccess()
                } catch {
                    //   toast.error('Update failed')
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
                            <option value="home">Home</option>
                            <option value="page">Page</option>
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
                    </div>

                    <Button type="submit" className="w-full">
                        Update Slider
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default EditSliderForm
