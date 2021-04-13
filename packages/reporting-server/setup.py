from setuptools import find_packages, setup

package_name = "reporting_server"

setup(
    name=package_name,
    description="RMF reporting server",
    version="0.0.0",
    packages=find_packages(exclude=["tests"]),
    author="Matias Bavera",
    author_email="matiasbavera@gmail.com",
    keywords=["RMF", "reporting"],
    classifiers=[
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python",
        "Topic :: Software Development",
    ],
    install_requires=[
        "fastapi~=0.63.0",
        "aiofiles~=0.6.0",
        "uvicorn[standard]~=0.13.4",
        "python-socketio~=5.1",
        "rx~=3.1",
        "tortoise-orm~=0.16.21",
        "pyjwt[crypto]~=2.0",
        "pydantic~=1.8",
    ],
    extras_require={
        "postgres": ["asyncpg~=0.22.0"],
        "mysql": ["aiomysql~=0.0.21"],
        "maria": ["aiomysql~=0.0.21"],
    },
    entry_points={
        "console_scripts": [
            "reporting_server=rest_server.__main__:main",
        ],
    },
    license="Apache License, Version 2.0",
)