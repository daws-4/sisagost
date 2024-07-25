"use client";
import { useEffect, useState } from "react";
import {
  Secondtitle,
  InputFilter,
  SelectFilter,
  LabelFilter,
  LabelButton,
} from "../../components/ui";
import DataTable from "react-data-table-component";
import HeaderNav from "../../components/static/HeaderNav";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import axios from 'axios'



export default function Home() {

  const router = useRouter()
  //fecth de la data
  //estados de los filtros

  const [filterId, setFilterId] = useState("");
  const [filterContratista, setFilterContratista] = useState("");
  const [filterDesde, setFilterDesde] = useState("");
  const [filterHasta, setFilterHasta] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("");
  const [filterEmpresa, setFilterEmpresa] = useState("");
  const [filterCi, setFilterCi] = useState("");
  const [filterFechaInstalacion, setFilterFechaInstalacion] = useState("");
  const [filterNodo, setFilterNodo] = useState("");

  //estados de la data
  const [data, setData] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<any[]>([]);
  const [user, setUser]= useState<any>({})

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
      const timeout = setTimeout(() => {
        setRecords(data);
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }, [data]);


  const desdeDate = new Date(filterDesde);
  const hastaDate = new Date(filterHasta);
  const desdeSiempre = new Date("01/01/1970");
  const hastaSiempre = new Date("01/01/2100");

  function idFilter() {
    const filteredRecords = data.filter((record) => {
      const recordDate = new Date(record.fecha_contrato);

      if (filterDesde == "" || filterHasta == "") {
        return (
          recordDate >= desdeSiempre &&
          recordDate <= hastaSiempre &&
          String(record.id).startsWith(filterId) &&
          String(record.contratista_asignado).includes(filterContratista) &&
          String(record.estatus_).includes(filterEstatus) &&
          String(record.empresa_contratista).includes(filterEmpresa) &&
          String(record.ci_cliente).includes(filterCi) &&
          String(record.fecha_instalacion)
            .toLocaleLowerCase()
            .includes(filterFechaInstalacion) &&
          String(record.nodo).toLocaleLowerCase().includes(filterNodo)
        );
      } else {
        return (
          String(record.id).startsWith(filterId) &&
          String(record.contratista_asignado).includes(filterContratista) &&
          recordDate >= desdeDate &&
          recordDate <= hastaDate &&
          String(record.estatus_).includes(filterEstatus) &&
          String(record.empresa_contratista).includes(filterEmpresa) &&
          String(record.ci_cliente).includes(filterCi) &&
          String(record.fecha_instalacion)
            .toLocaleLowerCase()
            .includes(filterFechaInstalacion.toLocaleLowerCase()) &&
          String(record.nodo).toLocaleLowerCase().includes(filterNodo.toLowerCase())
        );
      }
    });

    setRecords(filteredRecords);
  }

  //estados de los formularios
  const [id, setId] = useState<any[]>();
  const [contratista, setContratista] = useState<any[]>();
  const [desde, setDesde] = useState<any[]>();
  const [hasta, setHasta] = useState<any[]>();
  const [estatus, setEstatus] = useState<any[]>();
  const [empresa, setEmpresa] = useState<any[]>();
  const [ci, setCi] = useState<any[]>();
  const [fechaInstalacion, setFechaInstalacion] = useState<any[]>();
  const [nodo, setNodo] = useState<any[]>();

  function formReset() {
    setId([]);
    setFilterId("");
    setContratista([]);
    setFilterContratista("");
    setDesde([]);
    setFilterDesde("");
    setHasta([]);
    setFilterHasta("");
    setEstatus([]);
    setFilterEstatus("");
    setEmpresa([]);
    setFilterEmpresa("");
    setCi([]);
    setFilterCi("");
    setFechaInstalacion([]);
    setFilterFechaInstalacion("");
    setNodo([]);
    setFilterNodo("");
  }

  function formReset2() {
    setId(undefined);
    setContratista(undefined);
    setDesde(undefined);
    setHasta(undefined);
    setEstatus(undefined);
    setEmpresa(undefined);
    setCi(undefined);
    setFechaInstalacion(undefined);
    setNodo(undefined);
  }
  
  const mapedRecords = records.map((item, index) => {
    return item = Object.assign({index: `${index+1}`}, item)

   });
  const columns = [
    {
      name: '#',
      selector: (row:any,) => row.index,
      cell: (row:any,) => (<p>{row.index}</p>),
      maxWidth: '0',
    },
    {
      name: "Fecha del Contrato",
      selector: (row: any) => row.fecha_contrato,
      sortable: true,
      cell: (row: any) => {
        return (
           <Link href={`/contratos/${row.id}`}>
            {new Date(row.fecha_contrato).toLocaleDateString()}
          </Link>
        );
    },
    },
    {
      name: "ID de la ONT",
      selector: (row: any) => row.id,
      sortable: true,
      cell: (row: any) => {
        return <Link href={`/contratos/${row.id}`}>{row.id}</Link>;
      },
    },
    {
      name: "Status del Contrato",
      selector: (row: any) => row.estatus_,
      sortable: true,
      cell: (row: any) => {
        if (row.estatus_ === 0) {
          return <Link href={`/contratos/${row.id}`}>Agendado</Link>;
        } else if (row.estatus_ === 1) {
          return <Link href={`/contratos/${row.id}`}>Instalado</Link>;
        } else if (row.estatus_ === 2) {
          return <Link href={`/contratos/${row.id}`}>Finalizado</Link>;
        }
      },
    },
    {
      name: "Empresa Asignada",
      selector: (row: any) => row.empresa_contratista,
      sortable: true,
      cell: (row: any) => {
        if (row.empresa_contratista) {
          return <Link href={`/contratos/${row.id}`}>Servitel</Link>;
        } else {
          return <Link href={`/contratos/${row.id}`}>Hetelca</Link>;
        }
      },
    },
    {
      name: "Instalador Asignado",
      selector: (row: any) => row.contratista_asignado,
      sortable: true,
      cell: (row: any) => {
        return (
          <Link href={`/contratos/${row.id}`}><p>{row.contratista_asignado}</p></Link>
        );
      },
    },
  ];


  const estadisticData: any[] = [
          {
            activo: data.filter((record)=> record.estatus_ < 2).length,
            instalado: data.filter((record) => record.estatus_ === 1).length,
            finalizado: data.filter((record) => record.estatus_ === 2).length,
            agendado: data.filter((record) => record.estatus_ === 0).length,
            
          },
       
  ]


   const estadisticColumns = [
     {
       name: "Contratos Activos",
       selector: (row: any) => row.activo,
     },
     {
       name: "Contratos Agendados",
       selector: (row: any) => row.agendado,
     },
     {
       name: "Contratos Instalados",
       selector: (row: any) => row.instalado,
     },
     {
       name: "Contratos Finalizados",
       selector: (row: any) => row.finalizado,
     },
   ];
   const title = `Contratos ${now}`;

   const paginationComponentOptions = {
     rowsPerPageText: "Filas por página",
     rangeSeparatorText: "de",
     selectAllRowsItem: true,
     selectAllRowsItemText: "Todas",
   };

   //estado de la selección de la tabla
       const [selectedRows, setSelectedRows] = useState(false);
       const [toggledClearRows, setToggleClearRows] = useState(false);

        

       const handleChangeTable = ({ selectedRows }: { selectedRows: any }) => {
         setSelectedRows(selectedRows);
         console.log(selectedRows);
       };

       // Toggle the state so React Data Table changes to clearSelectedRows are triggered
       const handleClearRows = () => {
         setToggleClearRows(!toggledClearRows);
       };

   const logout = async () => {
     try {
       const res = await axios.get("/api/auth/logout");
     } catch (error:any) {
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
            data={estadisticData}
            columns={estadisticColumns}
            progressPending={loading}
            noDataComponent={"Loading..."}
            striped
          />
        </div>
      </div>

      <div className="md:px-20 px-5 z-10">
        <form className=" bg-gray-700 md:px-20 px-5 z-10 pt-5" id="contratForm">
          <LabelFilter htmlFor="fecha_desde">Desde</LabelFilter>
          <InputFilter
            type="date"
            id="fecha_desde"
            name="fecha_desde"
            value={desde}
            onClick={formReset2}
            onChange={(event) => setFilterDesde(event.target.value)}
          />
          <LabelFilter htmlFor="fecha_hasta">Hasta</LabelFilter>
          <InputFilter
            type="date"
            id="fecha_hasta"
            name="fecha_hasta"
            value={hasta}
            onClick={formReset2}
            onChange={(event) => setFilterHasta(event.target.value)}
          />
          <InputFilter
            type="text"
            name="id"
            placeholder="ID de la ONT"
            value={id}
            onClick={formReset2}
            onChange={(event) => setFilterId(event.target.value)}
          />
          <SelectFilter
            name="estatus_"
            value={estatus}
            onClick={formReset2}
            onChange={(event) => setFilterEstatus(event.target.value)}
          >
            <option defaultValue={[]}>Status</option>
            <option value="0">Agendado</option>
            <option value="1">Instalado</option>
            <option value="2">Finalizado</option>
          </SelectFilter>
          <SelectFilter
            name="empresa_contratista"
            value={empresa}
            onClick={formReset2}
            onChange={(event) => setFilterEmpresa(event.target.value)}
          >
            <option defaultValue={[]}>Empresa</option>
            <option value="0">Hetelca</option>
            <option value="1">Servitel</option>
          </SelectFilter>
          <InputFilter
            type="text"
            name="contratista_asignado"
            placeholder="Instalador Asignado"
            value={contratista}
            onClick={formReset2}
            onChange={(event) => setFilterContratista(event.target.value)}
          />
          <InputFilter
            type="text"
            name="ci_cliente"
            placeholder="Cédula del Cliente"
            value={ci}
            onClick={formReset2}
            onChange={(event) => setFilterCi(event.target.value)}
          />
          <LabelFilter htmlFor="fecha_instalacion">Instalado en</LabelFilter>
          <InputFilter
            type="date"
            name="fecha_instalacion"
            placeholder="Fecha de Instalación"
            id="fecha_instalacion"
            value={fechaInstalacion}
            onClick={formReset2}
            onChange={(event) => setFilterFechaInstalacion(event.target.value)}
          />
          <InputFilter
            type="text"
            name="nodo"
            placeholder="Nodo"
            value={nodo}
            onClick={formReset2}
            onChange={(event) => setFilterNodo(event.target.value)}
          />
          <LabelButton onClick={idFilter}>buscar</LabelButton>
          <LabelButton onClick={formReset}>Limpiar</LabelButton>
        </form>
      </div>

      <div className=" md:px-20 px-5 z-10 ">
        <button onClick={handleClearRows}>Clear Selected Rows</button>
        <DataTable
          title="Contratos"
          columns={columns}
          data={mapedRecords}
          pagination
          fixedHeader
          progressPending={loading}
          noDataComponent={"Loading..."}
          striped
          selectableRows
          onSelectedRowsChange={handleChangeTable}
          clearSelectedRows={toggledClearRows}
          paginationComponentOptions={paginationComponentOptions}
          paginationPerPage={20}
        />
      </div>
    </div>
  );
}
