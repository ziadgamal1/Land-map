import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRef, useEffect, useState } from "react";
export default function Login() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState<string>("");
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.replaceState({}, "", "/dashboard");
      return;
    }
    setShowDashboard(true);
    dialogRef.current?.showModal();
  }, []);
  async function signUpHandler(values: { userName: string; password: string }) {
    const response = await fetch("https://land-map-nine.vercel.app/signup", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    setMessage(responseData.message);
  }

  const validationSchema = Yup.object().shape({
    userName: Yup.string()
      .min(5, "Too Short!")
      .max(20, "Too Long!")
      .matches(
        /[^A-Za-z0-9]/,
        "Username must contain at least one special character"
      )
      .required("Required"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "Password must contain letters and numbers"
      )
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
  });
  if (showDashboard) {
    history.replaceState({}, "", "/login");
  }
  return (
    <dialog
      ref={dialogRef}
      className="absolute left-[45vw] top-[40vh] p-6 rounded-2xl "
    >
      <Formik
        initialValues={{ userName: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await fetch(
            "https://land-map-nine.vercel.app/login",
            {
              method: "POST",
              body: JSON.stringify(values),
            }
          );
          const responseData = await response.json();
          localStorage.setItem("token", responseData.token);
          if (response.ok) {
            history.replaceState({}, "", "/dashboard");
            dialogRef.current?.close();
            setSubmitting(false);
          } else {
            const responseData = await response.json();
            setMessage(responseData.message);
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <label className="text-left" htmlFor="userName">
              userName
            </label>
            <Field type="text" name="userName" />
            <ErrorMessage name="email" component="div" />
            <label className="text-left" htmlFor="password">
              password
            </label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <button
              className="crd-button"
              type="button"
              onClick={() => signUpHandler(values)}
            >
              Sign up
            </button>
            <button
              className="crd-button"
              type="submit"
              disabled={isSubmitting}
            >
              Login
            </button>
            {message && (
              <p
                className={`mt-3 ${
                  message.includes("Error") ? "text-red-600" : "text-green-600"
                } font-semibold`}
              >
                {message}
              </p>
            )}
          </Form>
        )}
      </Formik>
    </dialog>
  );
}
