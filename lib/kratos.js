import { Configuration, V0alpha2Api } from "@ory/kratos-client";

const config = new Configuration({ basePath: `${process.env.NEXT_PUBLIC_KRATOS_PUBLIC_API}` });

export const kratos = new V0alpha2Api(config);
