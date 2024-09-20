import os
import dotenv
import pandas as pd
from datetime import datetime
from psycopg2 import connect, sql
from psycopg2.extensions import cursor
from sqlalchemy import create_engine

dotenv.load_dotenv()

URL_API_TIFLUX = os.getenv("URL_API_TIFLUX")
URL_API_WPP = os.getenv("URL_API_WPP")
URL_BASE = os.getenv("URL_BASE")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
GMAIL_CLIENT_SECRET_FILE = os.getenv("GMAIL_CLIENT_SECRET_FILE")
GMAIL_CREDS_FILE = os.getenv("GMAIL_CREDS_FILE")


class Config:
    DB_HOST = DB_HOST
    DB_PORT = DB_PORT
    DB_NAME = DB_NAME
    DB_USER = DB_USER
    DB_PASSWORD = DB_PASSWORD


def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=current_app.config["DB_HOST"],
            port=current_app.config["DB_PORT"],
            database=current_app.config["DB_NAME"],
            user=current_app.config["DB_USER"],
            password=current_app.config["DB_PASSWORD"],
        )
        return conn
    except psycopg2.Error as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        raise


NAMES_PRO = [
    {
        "code": "CASE01",
        "id": 202899,
        "name": "CBRA01",
    },
    {
        "code": "ALPEL01",
        "id": 994764,
        "name": "ALPE01",
    },
    {
        "code": "GPINF01",
        "id": 1041730,
        "name": "GPIN01",
    },
    {
        "code": "GRFO01",
        "id": 202920,
        "name": "GRFOR1",
    },
    {
        "code": "NIDO01",
        "id": 202941,
        "name": "NBOX01",
    },
    {
        "code": "MFC01",
        "id": 202935,
        "name": "MFCS01",
    },
    {
        "code": "Edimotos",
        "id": 202911,
        "name": "EDIM01",
    },
    {
        "code": "DSL01",
        "id": 290583,
        "name": "DSLD01",
    },
    {
        "code": "MXCO01",
        "id": 951402,
        "name": "MAXC01",
    },
    {
        "code": "CDMAX",
        "id": 202901,
        "name": "CMAX01",
    },
]


conn = connect(
    host=DB_HOST, port=DB_PORT, database=DB_NAME, user=DB_USER, password=DB_PASSWORD
)

engine = create_engine(
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


def get_conn_db_name(db_name: str):
    conn = connect(
        host=DB_HOST, port=DB_PORT, database=db_name, user=DB_USER, password=DB_PASSWORD
    )
    return conn


def execute_query_all(cursor: cursor):
    columns = [desc[0] for desc in cursor.description]
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return results


def execute_query_field(cursor: cursor):
    columns = [desc[0] for desc in cursor.description]
    result = cursor.fetchone()
    if result:
        res_obj = {}
        for ind, cl in enumerate(columns):
            res_obj = {**res_obj, cl: result[ind]}
        result = res_obj
    return result


def save_row(cursor: cursor, table_name: str, row: pd.Series):
    row_dict = row.to_dict()

    columns = ", ".join(row_dict.keys())
    placeholders = ", ".join(["%s"] * len(row_dict))
    update_set = ", ".join([f"{key} = excluded.{key}" for key in row_dict.keys()])

    insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders}) ON CONFLICT (id) DO UPDATE SET {update_set}"

    cursor.execute(insert_query, list(row_dict.values()))


def insert_into_table(cursor: cursor, table_name: str, data_dict: dict, returning="id"):
    columns = data_dict.keys()
    values = [data_dict[col] for col in columns]
    insert_query = sql.SQL("INSERT INTO {} ({}) VALUES ({}) RETURNING {}").format(
        sql.Identifier(table_name),
        sql.SQL(", ").join(map(sql.Identifier, columns)),
        sql.SQL(", ").join(sql.Placeholder() * len(values)),
        sql.Identifier(returning),
    )
    cursor.execute(insert_query, values)
    return cursor.fetchone()[0]


def update_into_table(cursor: cursor, table_name: str, data_dict: dict):
    query = sql.SQL("UPDATE {} SET {} WHERE id = %s").format(
        sql.Identifier(table_name),
        sql.SQL(", ").join(
            sql.SQL("{} = %s").format(sql.Identifier(k))
            for k in data_dict.keys()
            if k != "id"
        ),
    )
    cursor.execute(query, list(data_dict.values())[1:] + [data_dict["id"]])


def delete_into_table(cursor: cursor, table: str, field: str, value):
    query = sql.SQL("DELETE FROM {} WHERE {} = %s").format(
        sql.Identifier(table), sql.Identifier(field)
    )
    cursor.execute(query, (value,))


def search_all(cursor: cursor, table: str, fields=None):
    if fields:
        if len(fields) == 1:
            query = sql.SQL("SELECT {} FROM {}").format(
                sql.Identifier(fields[0]),
                sql.Identifier(table),
            )
        else:
            query = sql.SQL("SELECT {} FROM {}").format(
                sql.SQL(", ").join(sql.Identifier(k) for k in fields),
                sql.Identifier(table),
            )
    else:
        query = sql.SQL("SELECT * FROM {}").format(
            sql.Identifier(table),
        )
    cursor.execute(query)


def search_extraction_date(cursor: cursor, key: str):
    query = """
        SELECT key, extraction_date AS date FROM data_extractions
        WHERE key = %s
        ORDER BY extraction_date DESC;
        """
    cursor.execute(query, (key,))


def search_by_field(cursor: cursor, table: str, field: str, value, fields=None):
    if fields:
        if len(fields) == 1:
            query = sql.SQL("SELECT {} FROM {} WHERE {} = %s").format(
                sql.Identifier(fields[0]),
                sql.Identifier(table),
                sql.Identifier(field),
            )
        else:
            query = sql.SQL("SELECT {} FROM {} WHERE {} = %s").format(
                sql.SQL(", ").join(sql.Identifier(k) for k in fields),
                sql.Identifier(table),
                sql.Identifier(field),
            )
    else:
        query = sql.SQL("SELECT * FROM {} WHERE {} = %s").format(
            sql.Identifier(table),
            sql.Identifier(field),
        )
    cursor.execute(query, (value,))


def generate_db_msg(cursor: cursor, key: str, obj_format=None):
    search_by_field(cursor, "generic_storages_value", "key", key, ["value"])
    result_template = execute_query_field(cursor)["value"]
    if obj_format:
        template = result_template.format(**obj_format)
    else:
        template = result_template
    return template.replace("\\n", "\n")


def generate_ticket_link(ticket_number: int):
    base_url = "https://suporte.insidedb.com.br/v/tickets/"
    return f"{base_url}{ticket_number}/basic_info"


def is_valid_datetime(dt: datetime):
    if dt.weekday() == 5:
        return False

    if dt.weekday() == 6:
        return False

    if dt.hour < 7 or dt.hour >= 19:
        return False

    return True


def saudacao(dt: datetime):
    hora_atual = dt.hour
    if 5 <= hora_atual < 12:
        return "Bom dia"
    elif 12 <= hora_atual < 18:
        return "Boa tarde"
    else:
        return "Boa noite"


def valid_msg(texto: str):
    if len(texto) > 150:
        return texto[:150] + "..."
    return texto
