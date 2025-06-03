import {ContactPage, CreditCard, DomainTwoTone} from "@mui/icons-material";
import type {OverridableComponent} from "@mui/material/OverridableComponent";
import type {SvgIconTypeMap} from "@mui/material";

interface INavigationPage {
    label: string;
    path: string;
    icon?: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
        muiName: string;
    };
}

export const userPages: INavigationPage[] = [
    {label: 'Mantenimientos', path: 'maintenances', icon: DomainTwoTone},
    {label: 'Movimientos', path: 'movements', icon: CreditCard},
    {label: 'Consultas y Reportes', path: 'reports', icon: ContactPage},
];
export const settings = ['Inicio', 'Perfil', 'Configuración', 'Cerrar sesión'];


