"use client";
import { useEffect, useState } from "react";
import { FormCrud, InputCrud, LabelCrud, SelectCrud } from "../../../../components/ui";
import HeaderNav from "../../../../components/static/HeaderNav";
import { toast, ToastContainer } from "react-toastify";
import "../../../../../node_modules/react-toastify/dist/ReactToastify.css";
import "../../../../../node_modules/react-toastify/dist/react-toastify.esm.mjs";
import { useRouter } from "next/navigation";
import React from "react";
import axios from "axios";

export default function Home({ params }: { params: { id: any } }) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const router = useRouter();


  //estados de la data
  const [data, setData] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const getUser = async () => {
      const usuario = await axios.get("/api/auth/admin");
      setUser(usuario);
    };
    getUser();
  }, []);
  useEffect(() => {
    const getData = async () => {
      const contratData = await axios.get(`/api/contratos/${params.id}`);
      setData(contratData.data);
    };
    getData();
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setId(data[0].id);
      setId_cuenta(data[0].id_cuenta);
      setFecha_contrato(data[0].fecha_contrato);
      setCi_cliente(data[0].ci_cliente);
      setContratista_asignado(data[0].contratista_asignado);
      setEmpresa_contratista(data[0].empresa_contratista);
      setEstatus_(data[0].estatus_);
      setFecha_instalacion(data[0].fecha_instalacion);
      setNodo(data[0].nodo);
      setPlan_contratado(data[0].plan_contratado);
      setTelefono_cliente(data[0].telefono_cliente);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [data]);
  const title = `Editar Contrato ${params.id}`;

    
  
 const [id, setId] = useState<string | undefined>();
 const [id_cuenta, setId_cuenta] = useState<string | undefined>();
 const [fecha_contrato, setFecha_contrato] = useState<string | undefined>();
 const [ci_cliente, setCi_cliente] = useState<string | undefined>();
 const [contratista_asignado, setContratista_asignado] = useState<string | undefined>();
 const [empresa_contratista, setEmpresa_contratista] = useState<string | undefined>();
 const [estatus_, setEstatus_] = useState<number | undefined>();
 const [fecha_instalacion, setFecha_instalacion] = useState<string | undefined>();
 const [nodo, setNodo] = useState<string | undefined>();
 const [plan_contratado, setPlan_contratado] = useState<string | undefined>();
 const [telefono_cliente, setTelefono_cliente] = useState<string | undefined>();

 function formReset2() {
   setId(undefined);
   setId_cuenta(undefined);
   setFecha_contrato(undefined);
   setCi_cliente(undefined);
   setContratista_asignado(undefined);
   setEmpresa_contratista(undefined);
   setEstatus_(undefined);
   setFecha_instalacion(undefined);
   setNodo(undefined);
   setPlan_contratado(undefined);
   setTelefono_cliente(undefined);
 }
const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  switch (name) {
    case "empresa_contratista":
      setEmpresa_contratista(value);
      break;
    case "estatus_":
      setEstatus_(Number(value));
      break;
    default:
      break;
  }
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
 };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          `/api/contratos/${params.id}/edit`,
          //credenciales o datos a enviar
        );
        console.log(response);

        if (response.status === 200) {
          setShowSuccessToast(true);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setShowErrorToast(true);
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
      toast.success("Registro Eliminado!", {
        position: "top-center",
        autoClose: 10000,
      });

      setTimeout(() => {
        router.push("/contratos");
      }, 4000);

      setShowSuccessToast(false);
    }

    if (showErrorToast) {
      toast.error("Error", {
        position: "top-center",
        className: "foo-bar",
        autoClose: false,
      });

      setShowErrorToast(false);
    }
  }, [showSuccessToast, showErrorToast, router]);

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

      <div className=" md:px-20 flex justify-center items-center px-5 pt-5 z-10 mb-10">
        <div className="flex flex-col justify-center items-center bg-gray-700 md:px-20 px-5 z-10 py-5  ">
          <div className=" max-w-screen-xl">
            <h3 className="text-3xl pb-4 font-bold dark:text-white">{title}</h3>
            <FormCrud onSubmit={handleSubmit}>
              <div className="flex flex-col flex-wrap">
                <div className="mr-2 mb-4 w-44">
                  <LabelCrud htmlFor="id">ID de la ONT</LabelCrud>
                  <InputCrud
                    onChange={handleChangeInput}
                    id="id"
                    type="text"
                    name="id"
                    onClick={formReset2}
                    placeholder="ID de la ONT"
                    value={id}
                  />
                </div>
                <div className="mr-2 mb-4 w-44">
                  <LabelCrud htmlFor="id_cuenta">ID de la cuenta</LabelCrud>
                  <InputCrud
                    onChange={handleChangeInput}
                    id="id_cuenta"
                    type="text"
                    name="id_cuenta"
                    onClick={formReset2}
                    placeholder="ID de la cuenta"
                    value={id_cuenta}
                  />
                </div>
                <div className="mr-2 mb-4 w-44">
                  <LabelCrud htmlFor="fecha_contrato">
                    fecha del contrato
                  </LabelCrud>
                  <InputCrud
                    onChange={handleChangeInput}
                    name="fecha_contrato"
                    onClick={formReset2}
                    id="fecha_contrato"
                    type="date"
                    placeholder="fecha del contrato"
                    value={
                      (fecha_contrato = new Date().toLocaleDateString("en-CA"))
                    }
                  />
                </div>
                <div className="mr-2 mb-4 w-44">
                  <LabelCrud htmlFor="ci_cliente">Cédula del Cliente</LabelCrud>
                  <InputCrud
                    onChange={handleChangeInput}
                    id="ci_cliente"
                    type="text"
                    name="ci_cliente"
                    onClick={formReset2}
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
                    onClick={formReset2}
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
                    onClick={formReset2}
                    value={empresa_contratista}
                  >
                    {empresa_contratista ? (
                      <option defaultValue={1}>Servitel</option>
                    ) : (
                      <option defaultValue={0}>Hetelca</option>
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
                <div className="ml-2 mb-4 w-44">
                  <LabelCrud htmlFor="estatus_">Status</LabelCrud>
                  <SelectCrud
                    onChange={handleChangeSelect}
                    id="estatus_"
                    name="estatus_"
                    onClick={formReset2}
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
                <div className="ml-2 mb-4 w-44">
                  <LabelCrud htmlFor="fecha_instalacion">
                    Fecha de Instalación
                  </LabelCrud>
                  <InputCrud
                    onChange={handleChangeInput}
                    name="fecha_instalacion"
                    onClick={formReset2}
                    id="fecha_instalacion"
                    type="date"
                    placeholder="Fecha de Instalación"
                    value={
            
                      (fecha_instalacion = new Date().toLocaleDateString(
                        "en-CA"
                      ))
                    }
                  />
                </div>
                <div className="ml-2 mb-4 w-44">
                  <LabelCrud htmlFor="nodo">Nodo</LabelCrud>
                  <InputCrud
                    onChange={handleChangeInput}
                    id="nodo"
                    type="text"
                    name="nodo"
                    onClick={formReset2}
                    placeholder="Nodo"
                    value={nodo}
                  />
                </div>
                <div className="ml-2 mb-4 w-44">
                  <LabelCrud htmlFor="plan_contratado">
                    Servicios Contratados
                  </LabelCrud>
                  <InputCrud
                    onChange={handleChangeInput}
                    id="plan_contratado"
                    type="text"
                    name="plan_contratado"
                    onClick={formReset2}
                    placeholder="Servicios Contratados"
                    value={plan_contratado}
                  />
                </div>
                <div className="ml-2 mb-6 w-44">
                  <LabelCrud htmlFor="telefono_cliente">
                    Teléfono del Cliente
                  </LabelCrud>
                  <InputCrud
                    onChange={handleChangeInput}
                    id="telefono_cliente"
                    type="text"
                    name="telefono_cliente"
                    onClick={formReset2}
                    placeholder="Teléfono del Cliente"
                    value={telefono_cliente}
                  />
                </div>
                <div className="ml-6 mb-6 mt-6 flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </FormCrud>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}