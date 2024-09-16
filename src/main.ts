/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import "reflect-metadata";
import Application from "@/libs/core/application/application";
import modules from "@/libs/bootstrap/modules";

async function bootstrap() {
  const application = await Application.getInstance().create(modules);

  application.enableShutdownHooks();

  application.start();
}

bootstrap();
