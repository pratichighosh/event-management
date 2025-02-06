const Footer = () => {
    return (
      <footer className="bg-gray-100 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;