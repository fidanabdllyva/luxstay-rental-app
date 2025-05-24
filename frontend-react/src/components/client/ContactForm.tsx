import { useFormik } from "formik"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { postContact } from "@/api/requests/contacts"
import { contactSchema } from "@/utils/validation"


const ContactForm = () => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: contactSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await postContact(values)
        // toast.success("Message sent successfully!")
        resetForm()
      } catch (error) {
        // toast.error("Failed to send message.")
        console.error(error)
      }
    },
  })

  return (
    <div className="flex-1 max-w-sm">
      <Card className="py-5">
        <CardHeader>
          <CardTitle className="text-2xl">Send us a message</CardTitle>
          <CardDescription className="text-sm">
            Fill out the form below and we'll respond as soon as possible.
          </CardDescription>
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-4">

            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Your name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-sm text-red-500">{formik.errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                placeholder="Your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input
                id="subject"
                name="subject"
                placeholder="Subject of your message"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="text-sm text-red-500">{formik.errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea
                id="message"
                name="message"
                placeholder="Your message"
                className="min-h-[120px] break-words"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.message && formik.errors.message && (
                <p className="text-sm text-red-500">{formik.errors.message}</p>
              )}
            </div>

            <Button type="submit" className="w-35">Send Message</Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export default ContactForm
