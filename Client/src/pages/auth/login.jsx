import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        localStorage.setItem("token", data.payload.token);
        sessionStorage.setItem("email", formData.email);
        sessionStorage.setItem("role", data.payload.user.role);
        toast({
          title: "Success",
          description: "You Have Logged In Successfully!",
        });
      } else {
        toast({
          title: "Sign In Failed",
          description: data?.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-4 text-sm text-gray-500">
          Don't have an account ?
          <Link
            className="ml-2 text-violet-600 font-semibold hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      <Link
        to="/auth/forgot-password"
        className="block text-center font-semibold text-sm text-violet-600 hover:underline"
      >
        Forgot password?
      </Link>
    </div>
  );
}

export default AuthLogin;
