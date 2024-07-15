"use client";
import { useEffect, useState } from "react";
import { FormCrud, InputCrud, LabelCrud, SelectCrud } from "../../../../components/ui";
import DataTable from "react-data-table-component";
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
  const [records, setRecords] = useState<any[]>([{ message: "no data" }]);
  const [loading, setLoading] = useState(true);
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
      setRecords(data);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [data]);

 const [credencials, setCredencials] = useState({

 });
 console.log('credenciales', credencials , 'records',records)

  const title = `Contrato ${params.id}`;
    const handleChange = (e: { target: { value: string; name: string } }) => {
      setCredencials({
        ...credencials,
        [e.target.name]: e.target.value,
       
      });
       console.log(credencials);
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          `/api/contratos/${params.id}/edit`,
          credencials
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
            <FormCrud onSubmit={handleSubmit}>
              <div className="flex flex-row flex-wrap">
                <div className="mb-4 ">
                  <LabelCrud htmlFor="id">ID de la ONT</LabelCrud>
                  <InputCrud
                    onChange={handleChange}
                    id="id"
                    type="text"
                    name="id"
                    placeholder="ID de la ONT"
                    value={records[0].id}
                  />
                </div>
                <div className="mb-4">
                  <LabelCrud htmlFor="id_cuenta">ID de la cuenta</LabelCrud>
                  <InputCrud
                    onChange={handleChange}
                    id="id_cuenta"
                    type="text"
                    name="id_cuenta"
                    placeholder="ID de la cuenta"
                    value={records[0].id_cuenta}
                  />
                </div>
                <div className="mb-4">
                  <LabelCrud htmlFor="fecha_contrato">
                    fecha del contrato
                  </LabelCrud>
                  <InputCrud
                    onChange={handleChange}
                    name="fecha_contrato"
                    id="fecha_contrato"
                    type="date"
                    placeholder="fecha del contrato"
                    value={
                      (records[0].fecha_contrato =
                        new Date().toLocaleDateString("en-CA"))
                    }
                  />
                </div>
                <div className="mb-4">
                  <LabelCrud htmlFor="ci_cliente">Cédula del Cliente</LabelCrud>
                  <InputCrud
                    onChange={handleChange}
                    id="ci_cliente"
                    type="text"
                    name="ci_cliente"
                    placeholder="Cédula del Cliente"
                    value={records[0].ci_cliente}
                  />
                </div>
                <div className="mb-4">
                  <LabelCrud htmlFor="contratista_asignado">
                    Contratista Asignado
                  </LabelCrud>
                  <InputCrud
                    onChange={handleChange}
                    id="contratista_asignado"
                    type="text"
                    name="contratista_asignado"
                    placeholder="Contratista Asignado"
                    value={records[0].contratista_asignado}
                  />
                </div>
                <div className="mb-4">
                  <LabelCrud htmlFor="empresa_contratista">
                    Empresa Instaladora
                  </LabelCrud>
                  <SelectCrud
                    onChange={handleChange}
                    id="empresa_contratista"
                    name="empresa_contratista"
                    value={records[0].empresa_contratista}
                  >
                    {records[0].empresa_contratista ? (
                      <option defaultValue={1}>Servitel</option>
                    ) : (
                      <option defaultValue={0}>Hetelca</option>
                    )}
                    {records[0].empresa_contratista ? (
                      <option value="0">Hetelca</option>
                    ) : (
                      <option value="1">Servitel</option>
                    )}
                  </SelectCrud>
                </div>
                <div className="mb-4">
                  <LabelCrud htmlFor="estatus_">Status</LabelCrud>
                  <SelectCrud
                    onChange={handleChange}
                    id="estatus_"
                    name="estatus_"
                  >
                    {records[0].estatus_ == 2 ? (
                      <option defaultValue={2}>Finalizado</option>
                    ) : records[0].estatus_ == 1 ? (
                      <option defaultValue={1}>Instalado</option>
                    ) : (
                      <option defaultValue={0}>Agendado</option>
                    )}
                    {records[0].estatus_ == 2 ? (
                      <br></br>
                    ) : records[0].estatus_ == 1 ? (
                      <option value="0">Agendado</option>
                    ) : (
                      <option value="1">Instalado</option>
                    )}
                  </SelectCrud>
                </div>
                <div className="mb-4">
                  <LabelCrud htmlFor="fecha_instalacion">
                    Fecha de Instalación
                  </LabelCrud>
                  <InputCrud
                    onChange={handleChange}
                    name="fecha_instalacion"
                    id="fecha_instalacion"
                    type="date"
                    placeholder="Fecha de Instalación"
                    value={
                      (records[0].fecha_instalacion =
                        new Date().toLocaleDateString("en-CA"))
                    }
                  />
                </div>
                <div className="mb-4">
                  <LabelCrud htmlFor="nodo">Nodo</LabelCrud>
                  <InputCrud
                    onChange={handleChange}
                    id="nodo"
                    type="text"
                    name="nodo"
                    placeholder="Nodo"
                    value={records[0].nodo}
                  />
                </div>
                <div className="mb-4">
                  <LabelCrud htmlFor="plan_contratado">
                    Servicios Contratados
                  </LabelCrud>
                  <InputCrud
                    onChange={handleChange}
                    id="plan_contratado"
                    type="text"
                    name="plan_contratado"
                    placeholder="Servicios Contratados"
                    value={records[0].plan_contratado}
                  />
                </div>
                <div className="mb-6">
                  <LabelCrud htmlFor="telefono_cliente">
                    Teléfono del Cliente
                  </LabelCrud>
                  <InputCrud
                    onChange={handleChange}
                    id="telefono_cliente"
                    type="text"
                    name="telefono_cliente"
                    placeholder="Teléfono del Cliente"
                    value={records[0].telefono_cliente}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Sign In
                  </button>
                  <a
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    href="#"
                  >
                    Forgot Password?
                  </a>
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
