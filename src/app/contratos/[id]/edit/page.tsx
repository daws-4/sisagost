"use client";
import { useEffect, useState } from "react";
import { FormCrud, InputCrud, LabelCrud } from "../../../../components/ui";
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


  console.log(records[0]);

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
    }, 4000);
    return () => clearTimeout(timeout);
  }, [data]);

 const [credencials, setCredencials] = useState({
   ci_cliente: records[0].ci_cliente,
   id: records[0].id,
   estatus: records[0].estatus_,
   id_cuenta: records[0].id_cuenta,
   direccion_contrato: records[0].direccion_contrato,
   telefono_cliente: records[0].telefono_cliente,
   empresa_contratista: records[0].empresa_contratista,
   contratista_asignado: records[0].contratista_asignado,
   nodo: records[0].nodo,
   motivo_standby: records[0].motivo_standby,
   fecha_instalacion : records[0].fecha_instalacion ,
   recursos_inventario_instalacion: records[0].recursos_inventario_instalacion,
   observaciones_instalacion: records[0].observaciones_instalacion,

 });

  const title = `Contrato ${params.id}`;
    const handleChange = (e: { target: { value: string; name: string } }) => {
      setCredencials({
        ...credencials,
        [e.target.name]: e.target.value,
      });
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

      <div className="md:px-20 flex justify-center items-center px-5 pt-5 z-10 mb-10">
        <div className="flex flex-col justify-center items-center max-w-md bg-gray-700 md:px-20 px-5 z-10 py-5 lg:max-w-lg ">
          <div className="w-full max-w-xs">
            <FormCrud onSubmit={handleSubmit}>
              <div className="mb-4">
                <LabelCrud htmlFor="fecha_contrato">fecha del contrato</LabelCrud>
                <InputCrud
                  onChange={handleChange}
                  id="fecha_contrato"
                  type="date"
                  placeholder="fecha del contrato"
                  value={'12-12-2022'}
                />
              </div>
              <div className="mb-6">
                <LabelCrud htmlFor="ci_cliente">Cédula del Cliente</LabelCrud>
                <InputCrud
                  onChange={handleChange}
                  id="ci_clienye"
                  type="text"
                  placeholder="Cédula del Cliente"
                  value={records[0].ci_liente}
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
            </FormCrud>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
