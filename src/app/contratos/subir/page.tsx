"use client";
import { useEffect, useState } from "react";
import {
  FormCrud,
  InputCrud,
  LabelCrud,
  SelectCrud,
} from "../../../components/ui";
import HeaderNav from "../../../components/static/HeaderNav";
import { toast, ToastContainer } from "react-toastify";
import "../../../../node_modules/react-toastify/dist/ReactToastify.css";
import "../../../../node_modules/react-toastify/dist/react-toastify.esm.mjs";
import { useRouter } from "next/navigation";
import React from "react";
import axios from "axios";

export default function Home({ params }: { params: { id: any } }) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showErrorToastMessage, setShowErrorToastMessage] = useState("Error");
  const [showSuccessToastMessage, setShowSuccessToastMessage] = useState("Registro exitoso");


  const router = useRouter();

  //estados de la data
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const getUser = async () => {
      const usuario = await axios.get("/api/auth/admin");
      setUser(usuario);
    };
    getUser();
  }, []);

  const title = `Subir Contrato`;

  const [id, setId] = useState<string | undefined>();
  const [id_cuenta, setId_cuenta] = useState<string | undefined>();
  const [fecha_contrato, setFecha_contrato] = useState<string | undefined>();
  const [ci_cliente, setCi_cliente] = useState<string | undefined>();
  const [contratista_asignado, setContratista_asignado] = useState<
    string | undefined
  >();
  const [empresa_contratista, setEmpresa_contratista] = useState<
    number | undefined
  >();
  const [estatus_, setEstatus_] = useState<number | undefined>();
  const [fecha_instalacion, setFecha_instalacion] = useState<
    string | undefined
  >();
  const [nodo, setNodo] = useState<string | undefined>();
  const [plan_contratado, setPlan_contratado] = useState<string | undefined>();
  const [telefono_cliente, setTelefono_cliente] = useState<
    string | undefined
  >();

  const[xml, setXml] = useState<any>();
  const[csv, setCsv] = useState<any>();

    const handleSubmitXml = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if(!xml)return
      try {
         const data = new FormData();
         data.set("file", xml);

         const response = await fetch("/api/contratos/subir/xml", {
           method: "POST",
           body: data,
         });
         console.log(response);
         const responseData = await response.json();
         console.log(responseData.message);

        if (response.status === 200) {
          setShowSuccessToast(true);
        }else if (response.status === 400) {
          setShowErrorToast(true);
          setShowErrorToastMessage(responseData.message);}
          else  if (response.status === 201) {
          setShowSuccessToast(true);
          setShowSuccessToastMessage(responseData.message);}
          else if (response.status === 401) {
          setShowErrorToast(true);
          setShowErrorToastMessage(responseData.message);
          }

      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setShowErrorToast(true);
          setShowErrorToastMessage(error.response.data.message);
        }
      }
    };



  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "empresa_contratista":
        setEmpresa_contratista(Number(value));
        break;
      case "estatus_":
        setEstatus_(Number(value));
        break;
      default:
        break;
    }
    console.log(estatus_, empresa_contratista);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "id":
        setId(value);
        break;
      case "id_cuenta":
        setId_cuenta(value);
        break;
      case "fecha_contrato":
        setFecha_contrato(value);
        break;
      case "ci_cliente":
        setCi_cliente(value);
        break;
      case "contratista_asignado":
        setContratista_asignado(value);
        break;
      case "fecha_instalacion":
        setFecha_instalacion(value);
        break;
      case "nodo":
        setNodo(value);
        break;
      case "plan_contratado":
        setPlan_contratado(value);
        break;
      case "telefono_cliente":
        setTelefono_cliente(value);
        break;
      default:
        break;
    }
    console.log(
      contratista_asignado,
      id,
      id_cuenta,
      ci_cliente,
      nodo,
      plan_contratado,
      telefono_cliente,
      fecha_contrato,
      fecha_instalacion
    );
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/contratos/subir`, {
        id,
        id_cuenta,
        fecha_contrato,
        ci_cliente,
        contratista_asignado,
        empresa_contratista,
        estatus_,
        fecha_instalacion,
        nodo,
        plan_contratado,
        telefono_cliente,
      });
      console.log(response);

      if (response.status === 200) {
        setShowSuccessToast(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setShowErrorToast(true);
        setShowErrorToastMessage(error.response.data.message);
      }
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      console.log(res);
    } catch (error: any) {
      console.error(error.message);
    }
    router.push("/");
  };

  useEffect(() => {
    if (showSuccessToast) {
      toast.success(showSuccessToastMessage, {
        position: "top-center",
        autoClose: 10000,
        toastId: "success",
      });

      setTimeout(() => {
        id ? router.push(`/contratos/${id}`) : router.push(`/contratos`);
        setShowSuccessToast(false);
      }, 4000);
    }

  }, [showSuccessToast, showErrorToast, router]);
  useEffect(() => {
    if (showErrorToast) {
      toast.error(showErrorToastMessage, {
        position: "top-center",
        className: "foo-bar",
        autoClose: 5000,
        toastId: "error",
      });
    }
  }, [ showErrorToast, router]);

  const fecha_contrato_date = new Date(fecha_contrato ?? "");
  const añoUTC = fecha_contrato_date.getUTCFullYear();
  const mesUTC = fecha_contrato_date.getUTCMonth() + 1;
  const díaUTC = fecha_contrato_date.getUTCDate();
  const mesFormateado = mesUTC < 10 ? `0${mesUTC}` : mesUTC;
  const díaFormateado = díaUTC < 10 ? `0${díaUTC}` : díaUTC;
  const fechaUTC_contrato = `${añoUTC}-${mesFormateado}-${díaFormateado}`;

  const fecha_instalacion_date = new Date(fecha_instalacion ?? "");
  const añoUTC_instalacion = fecha_instalacion_date.getUTCFullYear();
  const mesUTC_instalacion = fecha_instalacion_date.getUTCMonth() + 1;
  const díaUTC_instalacion = fecha_instalacion_date.getUTCDate();
  const mesFormateado_instalacion =
    mesUTC_instalacion < 10 ? `0${mesUTC_instalacion}` : mesUTC_instalacion;
  const díaFormateado_instalacion =
    díaUTC_instalacion < 10 ? `0${díaUTC_instalacion}` : díaUTC_instalacion;
  const fechaUTC_instalacion = `${añoUTC_instalacion}-${mesFormateado_instalacion}-${díaFormateado_instalacion}`;

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

      <div className=" md:px-20 flex flex-col sm:flex-row justify-center items-center px-5 pt-5 z-10 mb-10">
        <div className="flex flex-col mr-5 mb-10">
          <div className="flex flex-col justify-center items-center bg-gray-700 md:px-20 px-5 z-10 py-5  ">
            <div className="sm:w-sm max-w-screen-xl">
              <h3 className="text-3xl pb-4 font-bold dark:text-white">
                {title}
              </h3>
              <FormCrud onSubmit={handleSubmit}>
                <div className="flex flex-col flex-wrap">
                  <div className="mr-2 mb-4 w-44">
                    <LabelCrud htmlFor="id">ID de la ONT</LabelCrud>
                    <InputCrud
                      required={true}
                      onChange={handleChangeInput}
                      id="id"
                      type="text"
                      name="id"
                      placeholder="ID de la ONT"
                      value={id}
                    />
                  </div>
                  <div className="mr-2 mb-4 w-44">
                    <LabelCrud htmlFor="id_cuenta">ID de la cuenta</LabelCrud>
                    <InputCrud
                      required={true}
                      onChange={handleChangeInput}
                      id="id_cuenta"
                      type="text"
                      name="id_cuenta"
                      placeholder="ID de la cuenta"
                      value={id_cuenta}
                    />
                  </div>
                  <div className="mr-2 mb-4 w-44">
                    <LabelCrud htmlFor="fecha_contrato">
                      fecha del contrato
                    </LabelCrud>
                    <InputCrud
                      required={true}
                      onChange={handleChangeInput}
                      name="fecha_contrato"
                      id="fecha_contrato"
                      type="date"
                      placeholder="fecha del contrato"
                      value={fechaUTC_contrato}
                    />
                  </div>
                  <div className="mr-2 mb-4 w-44">
                    <LabelCrud htmlFor="ci_cliente">
                      Cédula del Cliente
                    </LabelCrud>
                    <InputCrud
                      required={true}
                      onChange={handleChangeInput}
                      id="ci_cliente"
                      type="text"
                      name="ci_cliente"
                      placeholder="Cédula del Cliente"
                      value={ci_cliente}
                    />
                  </div>
                  <div className="mr-2 mb-4 w-44">
                    <LabelCrud htmlFor="contratista_asignado">
                      Contratista Asignado
                    </LabelCrud>
                    <InputCrud
                      onChange={handleChangeInput}
                      id="contratista_asignado"
                      type="text"
                      name="contratista_asignado"
                      placeholder="Contratista Asignado"
                      value={contratista_asignado}
                    />
                  </div>
                  <div className="mr-2 mb-4 w-44">
                    <LabelCrud htmlFor="empresa_contratista">
                      Empresa Instaladora
                    </LabelCrud>
                    <SelectCrud
                      onChange={handleChangeSelect}
                      id="empresa_contratista"
                      name="empresa_contratista"
                      value={empresa_contratista}
                    >
                      {empresa_contratista ? (
                        <option defaultValue="1">Servitel</option>
                      ) : (
                        <option defaultValue="0">Hetelca</option>
                      )}
                      {empresa_contratista ? (
                        <option value="0">Hetelca</option>
                      ) : (
                        <option value="1">Servitel</option>
                      )}
                    </SelectCrud>
                  </div>
                </div>
                <div className="flex flex-col flex-wrap">
                  <div className="ml-0 sm:ml-2 mb-4 w-44">
                    <LabelCrud htmlFor="estatus_">Status</LabelCrud>
                    <SelectCrud
                      onChange={handleChangeSelect}
                      id="estatus_"
                      name="estatus_"
                      value={estatus_}
                    >
                      {estatus_ == 2 ? (
                        <option defaultValue={2}>Finalizado</option>
                      ) : estatus_ == 1 ? (
                        <option defaultValue={1}>Instalado</option>
                      ) : (
                        <option defaultValue={0}>Agendado</option>
                      )}
                      {estatus_ == 2 ? (
                        <br></br>
                      ) : estatus_ == 1 ? (
                        <option value="0">Agendado</option>
                      ) : (
                        <option value="1">Instalado</option>
                      )}
                    </SelectCrud>
                  </div>
                  <div className="ml-0 sm:ml-2 mb-4 w-44">
                    <LabelCrud htmlFor="fecha_instalacion">
                      Fecha de Instalación
                    </LabelCrud>
                    <InputCrud
                      onChange={handleChangeInput}
                      name="fecha_instalacion"
                      id="fecha_instalacion"
                      type="date"
                      placeholder="Fecha de Instalación"
                      value={fechaUTC_instalacion}
                    />
                  </div>
                  <div className="ml-0 sm:ml-2 mb-4 w-44">
                    <LabelCrud htmlFor="nodo">Nodo</LabelCrud>
                    <InputCrud
                      required={true}
                      onChange={handleChangeInput}
                      id="nodo"
                      type="text"
                      name="nodo"
                      placeholder="Nodo"
                      value={nodo}
                    />
                  </div>
                  <div className="ml-0 sm:ml-2 mb-4 w-44">
                    <LabelCrud htmlFor="plan_contratado">
                      Servicios Contratados
                    </LabelCrud>
                    <InputCrud
                      required={true}
                      onChange={handleChangeInput}
                      id="plan_contratado"
                      type="text"
                      name="plan_contratado"
                      placeholder="Servicios Contratados"
                      value={plan_contratado}
                    />
                  </div>
                  <div className="ml-0 sm:ml-2 mb-6 w-44">
                    <LabelCrud htmlFor="telefono_cliente">
                      Teléfono del Cliente
                    </LabelCrud>
                    <InputCrud
                      required={true}
                      onChange={handleChangeInput}
                      id="telefono_cliente"
                      type="text"
                      name="telefono_cliente"
                      placeholder="Teléfono del Cliente"
                      value={telefono_cliente}
                    />
                  </div>
                  <div className="ml-8 mb-6 mt-6 flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Subir
                    </button>
                  </div>
                </div>
              </FormCrud>
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-5">
          <div className="flex flex-col justify-center items-center bg-gray-700 md:px-20 mb-10 px-5 z-10 py-5  ">
            <div className="sm:w-sm max-w-screen-xl">
              <h3 className="text-3xl pb-4 font-bold dark:text-white">
                Subir Contratos XML
              </h3>
              <FormCrud
                onSubmit={handleSubmitXml}
              >
                <div className="flex flex-col">
                  <div className="sm:w-72 w-44">
                    <InputCrud
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          setXml(e.target.files[0]);
                          console.log(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                  <div className="ml-8 mb-6 mt-6 flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Subir XML
                    </button>
                  </div>
                </div>
              </FormCrud>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-gray-700 md:px-20 px-5 z-10 py-5  ">
            <div className="sm:w-sm max-w-screen-xl">
              <h3 className="text-3xl pb-4 font-bold dark:text-white">
                Subir Contratos CSV
              </h3>
              <FormCrud>
                <div className="flex flex-col">
                  <div className="sm:w-72 w-44">
                    <InputCrud type="file" />
                  </div>
                  <div className="ml-8 mb-6 mt-6 flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Subir CSV
                    </button>
                  </div>
                </div>
              </FormCrud>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
