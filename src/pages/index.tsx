import { AuthContext } from "@/contexts/AuthContext";
import { getAPICliente } from "@/services/axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useContext } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const { register, handleSubmit } = useForm();
  const { signIn, errorString } = useContext(AuthContext);

  async function SubmitUser(data: any) {
    await signIn(data);
  }
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <input
          type="email"
          placeholder="Email address"
          {...register("identifier")}
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        <button type="submit" onClick={handleSubmit(SubmitUser)}>
          {" "}
          Sign In
        </button>
        {errorString}
      </main>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["nextauth.token"]: jwt } = parseCookies(ctx);
  if (jwt) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
