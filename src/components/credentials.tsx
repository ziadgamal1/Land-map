import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRef, useEffect } from "react";
export default function Login() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);
  async function signUpHandler(values: { userName: string; password: string }) {
    const response = await fetch("http://localhost:8080/signup", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
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
  return (
    <dialog
      ref={dialogRef}
      className="absolute left-[45vw] top-[40vh] p-6 rounded-2xl "
    >
      <Formik
        initialValues={{ userName: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
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
          </Form>
        )}
      </Formik>
    </dialog>
  );
}
