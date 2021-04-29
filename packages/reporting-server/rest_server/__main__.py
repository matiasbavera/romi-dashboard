import uvicorn

from .app import get_app
from .app_config import app_config


def main():
    uvicorn.run(
        get_app(False),
        host=app_config.host,
        port=app_config.port,
        root_path=app_config.public_url.path,
        log_level=app_config.log_level.lower(),
    )


if __name__ == "__main__":
    main()
