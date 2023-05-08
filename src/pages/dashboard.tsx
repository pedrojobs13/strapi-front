import { AuthContext } from "@/contexts/AuthContext";
import { getAPICliente } from "@/services/axios";
import { GetServerSideProps } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { useContext } from "react";

interface FilesArray {
  sair: any;
  document: {
    title: string;
    publicacao: string;
    arquivos: [
      {
        id: number;
        name: string;
        url: string;
      }
    ];
  };
}

export default function dashboard({ document }: FilesArray) {
  const { user, signOut } = useContext(AuthContext);

  return (
    <>
      <h1>Dashboard:</h1> {user?.username} <br />
      <h2>{document.title}</h2>
      <button onClick={signOut} type="submit">
        Sair
      </button>
      {document.arquivos.map((arquivo) => {
        return (
          <div key={arquivo.id}>
            <a href={`http://localhost:1337${arquivo.url}`} target="black">
              {arquivo.name}
            </a>
          </div>
        );
      })}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPICliente(ctx);

  let document = "";
  try {
    const response = await apiClient.get(
      "/users/me?populate=document.arquivos"
    );
    document = await response.data.document;
  } catch (error) {
    destroyCookie(ctx, "nextauth.token");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      document,
    },
  };
};
