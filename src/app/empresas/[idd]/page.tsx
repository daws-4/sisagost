"use client";
import { useEffect, useState } from "react";
import {
  Secondtitle,
  CampoContrato,
  TitleContrato,
  TextContrato,
  CrudDelete,
  CrudUpdate,
} from "../../../components/ui";
import DataTable from "react-data-table-component";
import HeaderNav from "../../../components/static/HeaderNav";
import { toast, ToastContainer } from "react-toastify";
import "../../../../node_modules/react-toastify/dist/ReactToastify.css";
import "../../../../node_modules/react-toastify/dist/react-toastify.esm.mjs";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import React from "react";
import axios from "axios";

export default function Home({ params }: { params: { idd: any } }) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showErrorToastMessage, setShowErrorToastMessage] = useState("Error");
  const [showSuccessToastMessage, setShowSuccessToastMessage] =
    useState("Registro exitoso");

  const router = useRouter();

  //estados de la data
  const [data, setData] = useState<any[]>([]);
    const [instaladores, setInstaladores] = useState<any[]>([]);
    const [empresa, setEmpresa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});

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
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [data]);
  
  
  const records: any[] = [
    {
      activo: data.filter((record) => record.estatus_ < 2 && record.empresa_contratista == params.idd).length,
      instalado: data.filter((record) => record.estatus_ === 1 && record.empresa_contratista == params.idd).length,
      finalizado: data.filter((record) => record.estatus_ === 2 && record.empresa_contratista == params.idd).length,
      agendado: data.filter((record) => record.estatus_ === 0 && record.empresa_contratista == params.idd).length,
      instaladoresActivos: instaladores.filter(
        (instalador) => instalador.empresa == params.idd
      ).length,
    },
  ];

  const columns = [
    {
      name: "Instaladores Activos",
      selector: (row: any) => row.instaladoresActivos,
      minWidth: "20",
      center: true,
      cell: (row: any) => {return <p>{row.instaladoresActivos}</p>},
    },
    {
      name: "Contratos Activos",
      selector: (row: any) => row.activo,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.activo}</p>;
      },
    },
    {
      name: "Contratos Instalados",
      selector: (row: any) => row.instalado,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.instalado}</p>;
      },
    },
    {
      name: "Contratos Agendados",
      selector: (row: any) => row.agendado,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.agendado}</p>;
      },
    },
    {
      name: "Contratos Finalizados",
      selector: (row: any) => row.finalizado,
      minWidth: "20",
      center: true,
      cell: (row: any) => {{
          return <p>{row.finalizado}</p>;
        }
      },
    },
  ];

  const title = `Empresa ${params.idd == '1' ? 'Servitel' : 'Hetelca'} al día ${now}`;

  const logout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
    } catch (error: any) {
      console.error(error.message);
    }
    router.push("/");
  };

  //pdf
    const date = new Date().toLocaleDateString("es-ES");
    function createStatsPdf(divElement: any){

    const doc = new jsPDF();

    //const
      const activo = data.filter((record) => record.estatus_ < 2 && record.empresa_contratista == params.idd).length
      const instalado = data.filter((record) => record.estatus_ === 1 && record.empresa_contratista == params.idd).length
      const finalizado = data.filter((record) => record.estatus_ === 2 && record.empresa_contratista == params.idd).length
      const agendado = data.filter((record) => record.estatus_ === 0 && record.empresa_contratista == params.idd).length
      const instaladoresActivos = instaladores.filter(
        (instalador) => instalador.empresa == params.idd
      ).length


//texto
    doc.text(title, 60, 10);
    
    doc.text(`Instaladores Activos: ${instaladoresActivos}`, 30, 30);
    doc.text(`Contratos Instalados: ${instalado}`, 30, 40);
    doc.text(`Constratos Finalizados: ${finalizado}`, 30, 50);
    doc.text(`Constratos Agendados: ${agendado}`, 30, 60);
    doc.text(`Constratos Activos: ${activo}`, 30, 70);
    
    doc.save(`empresa-${params.idd == '1' ? 'Servitel' : 'Hetelca'}_${date}.pdf`);
  }

  useEffect(() => {
    if (showSuccessToast) {
      toast.success(showSuccessToastMessage, {
        position: "top-center",
        autoClose: 10000,
      });

      setTimeout(() => {
        router.push("/contratos");
      }, 4000);

      setShowSuccessToast(false);
    }

    if (showErrorToast) {
      toast.error(showErrorToastMessage , {
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
      <div className="md:px-20 px-5 pt-5 z-10">
        <div className="bg-gray-700 md:px-20 px-5 z-10 py-5">
          <DataTable
            title={title}
            columns={columns}
            data={records}
            progressPending={loading}
            noDataComponent={"Loading..."}
            striped
          />
        </div>
      </div>

      <div className="md:px-20 px-5 z-10 mb-10">
        <div className="flex flex-col bg-gray-700 md:px-20 px-5 z-10 py-5">
          <div id='Stats1' className="flex lg:flex-row flex-col">
            <CampoContrato href={`/instaladores`}>
              <TitleContrato>Instaladores</TitleContrato>
              <TextContrato>
                
              </TextContrato>
            </CampoContrato>
            <CampoContrato href="#">
              <TitleContrato>Inventario</TitleContrato>
              <TextContrato>
                {records[0]
                  ? records[0].contratista_asignado
                    ? records[0].contratista_asignado
                    : ""
                  : ""}
              </TextContrato>
            </CampoContrato>
            <CampoContrato href="#">
              <TitleContrato>Dirección</TitleContrato>
              <TextContrato>
                {records[0] ? records[0].direccion_contrato ?? "" : ""}
              </TextContrato>
            </CampoContrato>
            <CampoContrato href="#">
              <TitleContrato>Contacto</TitleContrato>
              <TextContrato>
                {records[0]?.estatus_
                  ? records[0]?.observaciones_instalacion ?? ""
                  : records[0]?.motivo_stanby ?? ""}
              </TextContrato>
            </CampoContrato>
          </div>
          <div className="flex lg:flex-row flex-col">
            <CrudUpdate onClick={(event)=>(createStatsPdf('Stats1'))}>Imprimir</CrudUpdate>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
