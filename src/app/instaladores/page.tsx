"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Secondtitle,
  InputFilter,
  SelectFilter,
  LabelFilter,
  LabelButton,
} from "../../components/ui";
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
  const [instaladores, setInstaladores] = useState<any[]>([]);
  const [empresa__, setEmpresa__] = useState<any[]>([]);
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
       .then(setEmpresa__);
   }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRecords(instaladores);
      console.log(records)
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [instaladores]);

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
          String(record.nodo)
            .toLocaleLowerCase()
            .includes(filterNodo.toLowerCase())
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
    return (item = Object.assign({ index: `${index + 1}` }, item));
  });
  const columns = [
    {
      name: "#",
      selector: (row: any) => row.index,
      cell: (row: any) => <p>{row.index}</p>,
      maxWidth: "0",
    },
    {
      name: "Nombres",
      selector: (row: any) => row.Nombres,
      sortable: true,
      cell: (row: any) => {
        return <Link href={`/instaladores/${row.C_Identidad}`}>{row.Nombres}</Link>;
      },
    },
    {
      name: "Apellidos",
      selector: (row: any) => row.id,
      sortable: true,
      cell: (row: any) => {
        return <Link href={`/instaladores/${row.C_Identidad}`}>{row.Apellidos}</Link>;
      },
    },
    {
      name: "Cédula de Identidad",
      selector: (row: any) => row.estatus_,
      sortable: true,
      cell: (row: any) => { return (
        <Link href={`/instaladores/${row.C_Identidad}`}>
          {row.C_Identidad}
        </Link>
      );
      },
    },
    {
      name: "Empresa Asignada",
      selector: (row: any) => row.empresa_contratista,
      sortable: true,
      cell: (row: any) => {
        if (row.empresa) {
          return <Link href={`/instaladores/${row.C_Identidad}`}>Servitel</Link>;
        } else {
          return <Link href={`/instaladores/${row.C_Identidad}`}>Hetelca</Link>;
        }
      },
    },
    {
      name: "Teléfono",
      selector: (row: any) => row.contratista_asignado,
      sortable: true,
      cell: (row: any) => {
        return <Link href={`/instaladores/${row.C_Identidad}`}>
            <p>{row.n_telefono}</p>
          </Link>
      },
    },
  ];

  const estadisticData: any[] = [
    {
      activo: instaladores.length,
      instalado: instaladores.filter((record) => record.empresa === 1).length,
      finalizado: instaladores.filter((record) => record.empresa === 0).length,
    },
  ];

  const estadisticColumns = [
    {
      name: "Instaladores Activos",
      selector: (row: any) => row.activo,
    },

    {
      name: "Instaladores Servitel",
      selector: (row: any) => row.instalado,
    },
    {
      name: "Instaladores Hetelca",
      selector: (row: any) => row.finalizado,
    },
  ];
  const title = `Instaladores ${now}`;

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todas",
  };

  //estado de la selección de la tabla
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [instalador, setInstalador] = useState<any>('')
  const [verifyInstaller, setVerifyInstaller] = useState<any>(0)
  const [verifyFinished, setVerifyFinished] = useState<any>(0)

  const handleChangeTable = ({ selectedRows }: { selectedRows: any }) => {
    setSelectedRows(selectedRows);
    // verificar que las condiciones se cumplen
    for (const rows of selectedRows) {
      if ((rows.contratista_asignado != 0)) {
        setVerifyInstaller(1);
        break;
      }else{
        setVerifyInstaller(0);}
        console.log("contrato seleccionado sin instalador asignado");
    }
    for(const rows of selectedRows){
            if (rows.estatus_ === 2) {
              setVerifyFinished(1);
              console.log("contrato seleccionado finalizado");
              break;
            } else {
              setVerifyFinished(0);
            }
    }
  };
  // cambiar estados para poder actualizar los registros de forma masiva
  const handleClearRows = () => {
    selectedRows.forEach((row: any, index: any) => {
      console.log(`Posición ${index}:`, row.id);
    });
    setToggleClearRows(!toggledClearRows);
  };
  const handleDeleteRows = async () => {
    const deletingRows = selectedRows.map((row: any) => row.id);
    console.log(deletingRows)
    try {
      const response = await axios.post("/api/contratos/delete", deletingRows);
      console.log(response);
      if (response.status === 200) {
        toast.dismiss();
        setShowSuccessToast( true);
        setShowSuccessToastMessage(response.data.message);
      }else if (response.status === 401) {
        toast.dismiss()
        setShowErrorToast(true);
        setShowErrorToastMessage(response.data.message);}
    } catch (error: any) {
      console.log(error)
      toast.dismiss();
      setShowErrorToast(true);
      setShowErrorToastMessage(error.response.data.message);
    }
    setToggleClearRows(!toggledClearRows);
  }
    const handleFinishRows = async () => {
      const finishRows = selectedRows.map((row: any) => row.id);
      console.log(finishRows);
      try {
        const response = await axios.post(
          "/api/contratos/finish",
          finishRows
        );
        console.log(response);
        if (response.status === 200) {
          toast.dismiss();
          setShowSuccessToast(true);
          setShowSuccessToastMessage(response.data.message);
        } else if (response.status === 401) {
          toast.dismiss();
          setShowErrorToast(true);
          setShowErrorToastMessage(response.data.message);
        }
      } catch (error: any) {
        console.log(error);
        toast.dismiss();
        setShowErrorToast(true);
        setShowErrorToastMessage(error.response.data.message);
      }
      setToggleClearRows(!toggledClearRows);
    };
      const handleUpdateRows = async () => {
        const updatingRows = selectedRows.map((row: any) => row.id);
        console.log(updatingRows);
        const instaladorAsig = instalador;
        try {
          const response = await axios.post("/api/contratos/update", {
            updatingRows,
            instaladorAsig,
          });
          console.log(response);
          if (response.status === 200) {
            toast.dismiss();
            setShowSuccessToast(true);
            setShowSuccessToastMessage(response.data.message);
          } else if (response.status === 401) {
            toast.dismiss();
            setShowErrorToast(true);
            setShowErrorToastMessage(response.data.message);
          }
        } catch (error: any) {
          console.log(error);
          toast.dismiss();
          setShowErrorToast(true);
          setShowErrorToastMessage(error.response.data.message);
        }
        setToggleClearRows(!toggledClearRows);
      };
  const contextActions = useMemo (() => {
    const handleDelete = () => {
      if (
        selectedRows.length < 2 ? window.confirm(
          `Estás seguro de que quieres ELIMINAR ${selectedRows.length} contrato?`): window.confirm(
          `Estás seguro de que quieres ELIMINAR ${selectedRows.length} contratos?`)
        )
       {
        handleDeleteRows();
      } 
    }
        const handleFinish = () => {
          if (
            selectedRows.length < 2
              ? window.confirm(
                  `Estás seguro de que quieres FINALIZAR ${selectedRows.length} contrato?`
                )
              : window.confirm(
                  `Estás seguro de que quieres FINALIZAR ${selectedRows.length} contratos?`
                )
          ) {
            handleFinishRows();
          }
        };

        const AsignarInstaladores = (e: { preventDefault: () => void }) => {
          e.preventDefault();
          if (
            selectedRows.length < 2
              ? window.confirm(
                  `Estás seguro de que quieres ASIGNAR ${selectedRows.length} contrato al INSTALADOR ${instalador}?`
                )
              : window.confirm(
                  `Estás seguro de que quieres ASIGNAR ${selectedRows.length} contratos al INSTALADOR ${instalador}?`
                )
          ) {
            handleUpdateRows();
          }
        };
    return (
      <div className="flex flex-row">
        {verifyInstaller ? (
          <p></p>
        ) : (
          <form onSubmit={AsignarInstaladores} className="mx-4">
            <InputFilter
              type="text"
              id="ci_i</InputFiutFilter>lador"
              name="ci_instalador"
              onChange={(event) => setInstalador(event.target.value)}
            />
            <button type="submit">Asignar</button>
          </form>
        )}
        <button onClick={handleDelete} className="mx-4">
          Eliminar
        </button>
        {verifyFinished ? (
          <p></p>
        ) : (
          <button onClick={handleFinish} className="mx-4">
            Finalizar
          </button>
        )}
      </div>
    ); 
  }, [ selectedRows, handleClearRows, handleDeleteRows, instalador]);

  //pdf
    const date = new Date().toLocaleDateString("es-ES")

   function createStatsPdf(divElement: any){
    const doc = new jsPDF();
    //contratos 
       const activo = data.filter((record) => record.estatus_ < 2).length.toString();
       const instalado = data.filter((record) => record.estatus_ === 1).length.toString();
       const finalizado = data.filter((record) => record.estatus_ === 2).length.toString();
       const agendado = data.filter((record) => record.estatus_ === 0).length.toString();

    //empresas

       const activo_servitel = data.filter((record) => record.estatus_ < 2 && record.empresa_contratista === 1).length.toString();
       const instalado_servitel = data.filter((record) => record.estatus_ === 1 && record.empresa_contratista === 1).length.toString();
       const finalizado_servitel = data.filter((record) => record.estatus_ === 2 && record.empresa_contratista === 1).length.toString();
       const agendado_servitel = data.filter((record) => record.estatus_ === 0 && record.empresa_contratista === 1).length.toString();

       const activo_hetelca = data.filter((record) => record.estatus_ < 2 && record.empresa_contratista === 0).length.toString();
       const instalado_hetelca = data.filter((record) => record.estatus_ === 1 && record.empresa_contratista === 0).length.toString();
       const finalizado_hetelca = data.filter((record) => record.estatus_ === 2 && record.empresa_contratista === 0).length.toString();
       const agendado_hetelca = data.filter((record) => record.estatus_ === 0 && record.empresa_contratista === 0).length.toString();

      doc.text(`Contratos ${now}`, 60, 20);

      //show contratos
      doc.text(`Contratos Activos: ${activo}`, 30, 40)
      doc.text(`Contratos Instalados: ${instalado}`, 30, 50);
      doc.text(`Contratos Finalizados: ${finalizado}`, 30, 60);
      doc.text(`Contratos Agendados: ${agendado}`, 30, 70)

      //show empresas
      doc.text('Servitel', 20, 90)
      doc.text(`Contratos Activos: ${activo_servitel}`, 30, 100);
      doc.text(`Contratos Instalados: ${instalado_servitel}`, 30, 110);
      doc.text(`Contratos Finalizado: ${finalizado_servitel}`, 30, 120);
      doc.text(`Contratos Agendados: ${agendado_servitel}`, 30, 130);
      doc.text("Hetelca", 20, 150);
      doc.text(`Contratos Activos: ${activo_hetelca}`, 30, 160);
      doc.text(`Contratos Instalados: ${instalado_hetelca}`, 30, 170);
      doc.text(`Contratos Finalizado: ${finalizado_hetelca}`, 30, 180);
      doc.text(`Contratos Agendados: ${agendado_hetelca}`, 30, 190);




      doc.save(`Estadísticas_Sisagost_${date}.pdf`);
  }

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

      <div className="md:px-20 px-5 z-10 mb-10">
        <div className="bg-gray-700 md:px-20 px-5 z-10 py-5">
          <div id="Stats1">
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
          <LabelButton onClick={(event) => createStatsPdf("Stats1")}>
            Imprimir
          </LabelButton>
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
        <DataTable
          title="Instaladores"
          columns={columns}
          data={mapedRecords}
          pagination
          fixedHeader
          progressPending={loading}
          noDataComponent={"Loading..."}
          striped
          selectableRows
          contextActions={contextActions}
          onSelectedRowsChange={handleChangeTable}
          clearSelectedRows={toggledClearRows}
          paginationComponentOptions={paginationComponentOptions}
          paginationPerPage={20}
        />
      </div>
      <ToastContainer />
    </div>
  );
}