import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from '@/components/LoginDialog';

const RestaurantSignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      valid = false;
    } else if (!/^\+?[0-9\s-()]{8,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid phone number';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      localStorage.setItem('accountType', 'restaurant');
      
      toast({
        title: "Account created successfully!",
        description: "You can now log in to your restaurant account.",
        duration: 3000
      });
      
      login(formData.phoneNumber, formData.password);
      
      setTimeout(() => {
        setLoginDialogOpen(true);
      }, 1500);
    }
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleBackToOptions = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleBackToOptions}
        >
          ← Back to options
        </Button>

        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Create Your Restaurant Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="restaurant@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pr-10"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pr-10"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <Checkbox 
                  id="agreeToTerms" 
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      agreeToTerms: checked === true
                    });
                    if (errors.agreeToTerms) {
                      setErrors({
                        ...errors,
                        agreeToTerms: ''
                      });
                    }
                  }}
                />
                <Label htmlFor="agreeToTerms" className="ml-2 text-sm">
                  I confirm that the above information is accurate and I agree to the{" "}
                  <a href="/terms" className="text-foodsnap-orange hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-foodsnap-orange hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            >
              Create Restaurant Account
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already registered?{" "}
              <button 
                onClick={handleLoginClick} 
                className="text-foodsnap-orange hover:underline font-medium"
              >
                Login Here
              </button>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <LoginDialog 
        isOpen={loginDialogOpen} 
        onClose={() => navigate('/')} 
      />
    </div>
  );
};

export default RestaurantSignUpForm;
