"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Secondtitle,
  InputFilter,
  SelectFilter,
  LabelFilter,
  LabelButton,
} from "../../components/ui";
import {ListElement} from "../../components/ui/empresa/index";
import jsPDF from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import "../../../node_modules/react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import HeaderNav from "../../components/static/HeaderNav";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import axios from "axios";

export default function Home() {

  //toast 
 const [showSuccessToast, setShowSuccessToast] = useState(false);
 const [showErrorToast, setShowErrorToast] = useState(false);
 const [showErrorToastMessage, setShowErrorToastMessage] = useState("Error");
 const [showSuccessToastMessage, setShowSuccessToastMessage] = useState("Registro exitoso");

  const router = useRouter();
  //fecth de la data
 
  //estados de la data
  const [data, setData] = useState<any[]>([]);
  const [instaladores, setInstaladores] = useState<any[]>([]);
  const [empresa, setEmpresa] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  
  // requerir los datos de la api

  useEffect(() => {
    const getUser = async () => {
      const usuario = await axios.get("/api/auth/admin");
      setUser(usuario);
    };
    getUser();
  }, []);

  useEffect(() => {
    const getNow = async () => {
      const horaActual = await axios.get("/api/now");
      setNow(horaActual.data);
    };
    getNow();
  }, []);

  useEffect(() => {
  fetch("/api/contratos")
     .then((res) => res.json())
     .then(setData);
  }, []);
    useEffect(() => {
      fetch("/api/instaladores")
        .then((res) => res.json())
        .then(setInstaladores);
    }, []);
    useEffect(() => {
      fetch("/api/empresas")
        .then((res) => res.json())
        .then(setEmpresa);
    }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRecords(data);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [data]);

  //logout

  const logout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
    } catch (error: any) {
      console.error(error.message);
    }
    router.push("/");
  };
// estados de los toast
   useEffect(() => {
    if (showSuccessToast) {
      toast.success(showSuccessToastMessage, {
        position: "top-center",
        autoClose: 10000,
        toastId: "success",
      });
      setTimeout(() => {
        location.reload()
        setShowSuccessToast(false);
      }, 4000);
    }

  }, [showSuccessToast, showErrorToast, router]);
  useEffect(() => {
    if (showErrorToast) {
      toast.error(showErrorToastMessage, {
        position: "top-center",
        className: "foo-bar",
        autoClose: false,
        toastId: "error",
      });
    }})

  return (
    <div>
      <ToastContainer />
      <HeaderNav>
        <ul>
          <li>
            {user.data ? user.data.nombres : ""}{" "}
            {user.data ? user.data.apellidos : ""}
          </li>
          <li>
            <button onClick={() => logout()}>cerrar sesión</button>
          </li>
        </ul>
      </HeaderNav>
      <div>
        <Secondtitle>
          Bienvenido {user.data ? user.data.nombres : ""}
        </Secondtitle>
      </div>
      <div className=" md:px-20 flex flex-col sm:flex-row justify-center items-center px-5 pt-5 z-10 mb-10">
        <div className="flex flex-wrap mr-5 mb-10">
          {empresa.map((empresas) => (
            <div className="flex flex-col min-w-6xl justify-center items-center bg-gray-700 md:px-20 px-5 z-10 py-5 mr-5">
              <h3 className="text-3xl pb-4 font-bold dark:text-white">
                <Link href={`empresas/${empresas.id}`}>{empresas.nombre}</Link>
              </h3>
              <ul>
                <ListElement>
                  {"Instaladores Activos: "}
                  {
                    instaladores.filter(
                      (instalador) => instalador.empresa === empresas.id
                    ).length
                  }
                </ListElement>
                <ListElement>
                  {"Contratos Activos: "}
                  {
                    data.filter(
                      (contrato) =>
                        contrato.empresa_contratista === empresas.id &&
                        contrato.estatus_ < 2
                    ).length
                  }
                </ListElement>
                <ListElement>
                  {"Contratos Agendados: "}
                  {
                    data.filter(
                      (contrato) =>
                        contrato.empresa_contratista === empresas.id &&
                        contrato.estatus_ == 0
                    ).length
                  }
                </ListElement>
                <ListElement>
                  {"Contratos Instalados: "}
                  {
                    data.filter(
                      (contrato) =>
                        contrato.empresa_contratista === empresas.id &&
                        contrato.estatus_ == 1
                    ).length
                  }
                </ListElement>
                <ListElement>
                  {"Contratos Finalizados: "}
                  {
                    data.filter(
                      (contrato) =>
                        contrato.empresa_contratista === empresas.id &&
                        contrato.estatus_ == 2
                    ).length
                  }
                </ListElement>
              </ul>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
