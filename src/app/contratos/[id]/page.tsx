"use client";
import { useEffect, useState } from "react";
import {
  Secondtitle,
  CampoContrato,
  TitleContrato,
  TextContrato
} from "../../../components/ui";
import DataTable from "react-data-table-component";
import HeaderNav from "../../../components/static/HeaderNav";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import axios from 'axios'



export default function Home({ params }: { params: { id: any } }) {


  const router = useRouter();

  //estados de la data
  const [data, setData] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([{ message: "no data" }]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  
  console.log(records[0], now);
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
    const getData = async () => {
      const contratData = await axios.get(`/api/contratos/${params.id}`)
      setData(contratData.data)
    };
    getData()
  }, []);
  useEffect(() => {
    
    const timeout = setTimeout(() => {
      setRecords(data);
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [data]);

  const columns = [
    {
      name: "Fecha del Contrato",
      selector: (row: any) => row.fecha_contrato,
      minWidth: "20",
      center: true,
      cell: (row: any) => new Date(row.fecha_contrato).toLocaleDateString(),
    },
    {
      name: "ID de la ONT",
      selector: (row: any) => row.id,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.id}</p>;
      },
    },
    {
      name: "C.I del cliente",
      selector: (row: any) => row.ci_cliente,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.ci_cliente}</p>;
      },
    },
    {
      name: "Cuenta del Cliente",
      selector: (row: any) => row.id_cuenta,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.id_cuenta}</p>;
      },
    },
    {
      name: "Status del Contrato",
      selector: (row: any) => row.estatus_,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        if (row.estatus_ === 0) {
          return <p>Agendado</p>;
        } else if (row.estatus_ === 1) {
          return <p>Instalado</p>;
        } else if (row.estatus_ === 2) {
          return <p>Finalizado</p>;
        }
      },
    },
    {
      name: "Plan Contratado",
      selector: (row: any) => row.plan_contratado,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.plan_contratado}</p>;
      },
    },
    {
      name: "Teléfono del Cliente",
      selector: (row: any) => row.telefono_cliente,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.telefono_cliente}</p>;
      },
    },
    {
      name: "Nodo",
      selector: (row: any) => row.nodo,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.nodo}</p>;
      },
    },
    {
      name: "Fecha de Instalación",
      selector: (row: any) => row.fecha_instalacion,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.fecha_instalacion}</p>;
      },
    },
  ];

  const title = `Contrato ${params.id} al día ${now}`;


  const logout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      console.log(res);
    } catch (error: any) {
      console.error(error.message);
    }
    router.push("/");
  };

  return (
    <div>
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

      <div className="md:px-20 px-5 z-10 mb-10">
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
        <div className="flex flex-row bg-gray-700 md:px-20 px-5 z-10 py-5">
          <CampoContrato>
            <TitleContrato>Empresa</TitleContrato>
          <TextContrato></TextContrato>
          </CampoContrato>
          <CampoContrato>
            <TitleContrato>Instalador</TitleContrato>
            <TextContrato></TextContrato>
          </CampoContrato>
        </div>
      </div>
    </div>
  );
}
