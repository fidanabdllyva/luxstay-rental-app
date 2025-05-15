import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Github, Instagram, Linkedin, Twitter, Copyright } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col">
      <div className="flex flex-wrap justify-between bg-accent p-8 py-10 ">
        <div className="max-w-[300px] mb-6 md:mb-0">
          <h3 className="font-bold mb-4 text-xl">LuxStay</h3>
          <p className="text-sm mb-4 text-muted-foreground">
          Premium apartment rentals for travelers who expect the best. Find your perfect stay with us.
          </p>
          <div className="flex gap-2 text-muted-foreground cursor-pointer">
            <Twitter size={20} />
            <Facebook size={20} />
            <Instagram size={20} />
            <Github size={20} />
            <Linkedin size={20} />
          </div>
        </div>

        <div className="mb-6 md:mb-0">
          <h3 className="font-bold mb-4">Quick Links</h3>
          <div className="flex flex-col text-sm gap-3 text-muted-foreground">
            <Link to="/about">About us</Link>
            <Link to="/apartments">Apartments</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">Terms & Conditions</Link>
          </div>
        </div>

        <div className="mb-6 md:mb-0">
          <h3 className="font-bold mb-4">Support</h3>
          <div className="flex flex-col text-sm gap-3 text-muted-foreground">
            <Link to="/contact">FAQ</Link>
            <Link to="/contact">Help Center</Link>
            <Link to="/contact">Cancellation Options</Link>
            <Link to="/contact">Safety Information</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4">Newsletter</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Subscribe to our newsletter to get the latest updates.
          </p>
          <div className='flex gap-3 items-center'>
            <Input  placeholder="Your email" className=" bg-white" />
            <Button >Subscribe</Button>
          </div>
        </div>
      </div>

      <div className="flex items-center bg-accent justify-center py-10 border-t gap-1">
        <Copyright size={13} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">2025 ModernBlog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
