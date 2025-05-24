import ContactForm from '@/components/client/ContactForm'
import { Mail, MapPin, Phone } from 'lucide-react'

const Contact = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className='font-bold text-3xl mb-6'>Contact Us</h1>

      <div className='flex flex-col md:flex-row gap-10'>

        <div className="flex-1">
          <h3 className='font-bold text-xl mb-4'>Get In Touch</h3>
          <p className='text-sm'>
            Have a question, suggestion, or just want to say hello? We'd love to hear from you.
            Fill out the form and we'll get back to you as soon as possible.
          </p>

          <div className='flex flex-col gap-6 mt-6'>

            <div className='flex items-center gap-3'>
              <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center p-2">
                <Mail size={18} className="text-muted-foreground" />
              </div>
              <div className='text-sm'>
                <h3 className='font-semibold'>Email</h3>
                <p className='text-muted-foreground'>contact@modernblog.com</p>
              </div>
            </div>


            <div className='flex items-center gap-3'>
              <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center p-2">
                <Phone size={18} className="text-muted-foreground" />
              </div>
              <div className='text-sm'>
                <h3 className='font-semibold'>Phone</h3>
                <p className='text-muted-foreground'>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center p-2">
                <MapPin size={18} className="text-muted-foreground" />
              </div>
              <div className='text-sm'>
                <h3 className='font-semibold'>Address</h3>
                <p className='text-muted-foreground'>123 Blog Street, Content City, 10001</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
            <ContactForm/>
        </div>

      </div>
    </div>
  )
}

export default Contact