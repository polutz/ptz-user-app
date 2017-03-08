declare module ptzUserApp {
    export function UserApp(userRepository: IUserRepository):IUserApp;
}

declare module "ptz-user-app"
{
    export = ptzUserApp;
}