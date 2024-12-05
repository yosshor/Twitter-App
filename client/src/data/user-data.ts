import { UserRoleOptions } from "../views/components/user-role/UserRole";

 const userData = [
    {
        id: crypto.randomUUID(),
        name: "Yossi Shor",
        // role: "Admin",
        role: UserRoleOptions.admin,
        url: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
        email: "Yossi@gmail.com"
    },
    {
        id: crypto.randomUUID(),
        name: "Moshe Kelin",
        url: "https://as2.ftcdn.net/v2/jpg/03/03/11/75/1000_F_303117590_NNmo6BS2fOBEmDp8uKs2maYmt03t8fSL.jpg",
        email: "Moshe@gmail.com",
        role: UserRoleOptions.user
    },
    {
        id: crypto.randomUUID(),
        name: "David Levi",
        role: UserRoleOptions.superuser,
        url: "https://as1.ftcdn.net/v2/jpg/02/43/12/34/1000_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
        email: "David@gmail.com"
    },
    {
        id: crypto.randomUUID(),
        name: "Shimon Cohen",
        role: UserRoleOptions.guest,
        url: "https://as1.ftcdn.net/v2/jpg/03/02/88/46/1000_F_302884605_actpipOdPOQHDTnFtp4zg4RtlWzhOASp.jpg",
        email: "Shimon@gmail.com"
    },
    {
        id: crypto.randomUUID(),
        name: "Yael Guetta",
        role: UserRoleOptions.moderator,
        url: null,
        email: "Yeal@gmail.com"
    }
]

export default userData;