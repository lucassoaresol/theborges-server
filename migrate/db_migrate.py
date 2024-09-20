import arrow
import json
from psycopg2.extensions import connection
from setup import (
    conn,
    get_conn_db_name,
    execute_query_all,
    insert_into_table,
    search_all,
    search_by_field,
    execute_query_field,
    update_into_table,
    delete_into_table,
)


class DBMigrate:
    def __init__(self, connection: connection, db_name: str):
        self.connection_old = get_conn_db_name(db_name)
        self.cursor_old = self.connection_old.cursor()
        self.connection = connection
        self.cursor = self.connection.cursor()

    def __enter__(self):
        # self.extract_old_save(
        #     "operating_hours",
        #     "operating_hours",
        #     additional_processing=self.save_json_arr_times,
        # )

        # query = """SELECT s.id, s."name", s."durationMinutes", s.price, s.color, s."isAdditional", s."additionalPrice",
        # s.description, s."categoryId", c."name" AS category_name, c.color AS category_color FROM services s
        # JOIN categories c ON s."categoryId" = c.id;"""
        # self.extract_old_save(
        #     "services", "services", query, additional_processing=self.save_service
        # )

        query = """SELECT b.id, b."startTime", b."endTime", b.status, b."clientId", b."professionalId",
c."name" AS client_name, c.email AS client_email, c."birthDay", c."birthMonth",
c."wantsPromotions", c.public_id AS publicId, c.phone, p."name" AS professional_name,
p.email AS professional_email FROM bookings b
JOIN clients c ON b."clientId" = c.id
JOIN professionals p ON b."professionalId" = p.id;"""

        self.extract_old_save(
            "bookings", "bookings", query, additional_processing=self.save_booking
        )

        # self.extract_old_save("generic_storages_value", "generic_storages_value")

        # self.extract_old_save("monitoring_softwares", "monitoring_softwares")

        # self.extract_old_save("desks", "desks", is_pop_id=False)

        # self.extract_old_save("clients", "clients", is_pop_id=False)

        # self.extract_old_save("users", "users", is_pop_id=False)

        # self.extract_old_save("tickets", "tickets", is_pop_id=False)

        # self.extract_old_save("chats", "chats", is_pop_id=False)

        # query = """SELECT d.id, d.objid, d.name, d.port, d.extraction_date,
        # d.software_id, d.client_id, a.address AS host FROM devices d
        # JOIN device_addresses da ON da.key = d.address_id
        # JOIN addresses a ON a.id = da.address_id;"""
        # self.extract_old_save("devices", "devices", query, False, self.save_device)

        # self.extract_old_save("access_loss_histories", "access_loss_histories")

        # self.extract_old_save("device_loss_histories", "device_loss_histories")

        # query = """SELECT s.id, s.objid, s.name, s.ticket_number, s.is_alert,
        # s.is_closed, s.extraction_date, s.device_id, n.date, n.status,
        # n.status_icon, n.status_raw, n.message FROM sensors s
        # JOIN notices n ON n.id = s.notice_id;"""
        # self.extract_old_save("sensors", "sensors", query, False, self.save_sensor)

        # self.extract_old_save("emails", "emails", is_pop_id=False)

        # self.extract_old_save("jobs", "jobs")

        # self.extract_old_save("email_jobs", "email_jobs", is_pop_id=False)

        # self.extract_old_save("backups", "backups")

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cursor_old.close()
        self.connection_old.close()
        self.cursor.close()

    def extract_old_save(
        self,
        table_old: str,
        table: str,
        query=None,
        is_pop_id=True,
        additional_processing=None,
    ):
        if query:
            self.cursor_old.execute(query)
        else:
            search_all(self.cursor_old, table_old)
        result = execute_query_all(self.cursor_old)
        for res in result:
            if is_pop_id:
                res.pop("id")
            if additional_processing:
                additional_processing(res)
            else:
                insert_into_table(self.cursor, table, res)
                self.connection.commit()

    def save_service(self, res):
        category_dict = {
            "name": res.pop("category_name"),
            "color": res.pop("category_color"),
        }
        search_by_field(
            self.cursor, "categories", "name", category_dict["name"], ["id"]
        )
        result_category = execute_query_field(self.cursor)
        if result_category:
            category_dict["id"] = result_category["id"]
        else:
            category_dict["id"] = insert_into_table(
                self.cursor, "categories", category_dict
            )
            self.connection.commit()
        insert_into_table(
            self.cursor, "services", {**res, "categoryId": category_dict["id"]}
        )
        self.connection.commit()

    def save_booking(self, res):
        client_dict = {
            "name": res.pop("client_name"),
            "email": res.pop("client_email"),
            "birthDay": res.pop("birthDay"),
            "birthMonth": res.pop("birthMonth"),
            "wantsPromotions": res.pop("wantsPromotions"),
            "publicId": res.pop("publicid"),
            "phone": res.pop("phone"),
        }
        search_by_field(self.cursor, "clients", "email", client_dict["email"], ["id"])
        result_client = execute_query_field(self.cursor)
        if result_client:
            client_dict["id"] = result_client["id"]
        else:
            client_dict["id"] = insert_into_table(self.cursor, "clients", client_dict)
            self.connection.commit()
        professional_dict = {
            "name": res.pop("professional_name"),
            "email": res.pop("professional_email"),
        }
        search_by_field(
            self.cursor, "professionals", "email", professional_dict["email"], ["id"]
        )
        result_professional = execute_query_field(self.cursor)
        if result_professional:
            professional_dict["id"] = result_professional["id"]
        else:
            professional_dict["id"] = insert_into_table(
                self.cursor, "professionals", professional_dict
            )
            self.connection.commit()
        startTime = arrow.get(res.pop("startTime"))
        endTime = arrow.get(res.pop("endTime"))
        date = startTime.replace(hour=0, minute=0, second=0, microsecond=0)
        time_difference = startTime - date
        startTime = time_difference.total_seconds() / 60
        time_difference = endTime - date
        endTime = time_difference.total_seconds() / 60
        insert_into_table(
            self.cursor,
            "bookings",
            {
                **res,
                "date": date.datetime,
                "startTime": startTime,
                "endTime": endTime,
                "clientId": client_dict["id"],
                "professionalId": professional_dict["id"],
            },
        )
        self.connection.commit()

    def save_device(self, res):
        host = res.pop("host")
        device_id = res["id"]
        client_id = res["client_id"]
        insert_into_table(self.cursor, "devices", res)
        self.connection.commit()
        key_dv_add = self.save_link(
            {"address": host, "client_id": client_id, "device_id": device_id}
        )
        update_into_table(
            self.cursor, "devices", {"id": device_id, "address_id": key_dv_add}
        )
        self.connection.commit()
        query = f"""SELECT a.address, da.device_id, a.client_id FROM addresses a 
        JOIN device_addresses da ON da.address_id = a.id
        WHERE NOT address = '{host}' AND device_id = '{device_id}';"""
        self.extract_old_save("addresses", "addresses", query, False, self.save_link)

    def save_link(self, res):
        device_id = res.pop("device_id")
        address = res["address"]
        client_id = res["client_id"]
        query = f"""SELECT id FROM addresses WHERE address = '{address}' AND client_id = {client_id}"""
        self.cursor.execute(query)
        res_address = execute_query_field(self.cursor)
        address_id = res_address["id"] if res_address else None
        if not res_address:
            address_id = insert_into_table(self.cursor, "addresses", res)
            self.connection.commit()
        key_dv_add = insert_into_table(
            self.cursor,
            "device_addresses",
            {"device_id": device_id, "address_id": address_id},
            "key",
        )
        self.connection.commit()
        return key_dv_add

    def save_email_job(self, res):
        search_by_field(self.cursor, "jobs", "name", res["name"], ["id"])
        result_job = execute_query_field(self.cursor)
        if result_job:
            res.pop("name")
            data_dict = {**res, "job_id": result_job["id"]}
            insert_into_table(self.cursor, "email_jobs", data_dict)
            self.connection.commit()

    def save_json(self, res):
        res["data"] = json.dumps(res["data"])
        insert_into_table(self.cursor, "generic_storages_json", res)
        self.connection.commit()

    def save_json_arr_times(self, res):
        res["time"] = json.dumps(res["time"])
        insert_into_table(self.cursor, "operating_hours", res)
        self.connection.commit()

    def save_sensor(self, res):
        sensor_id = res["id"]

        sensor_data_dict = {
            "id": sensor_id,
            "objid": res["objid"],
            "name": res["name"],
            "ticket_number": res["ticket_number"],
            "is_alert": res["is_alert"],
            "is_closed": res["is_closed"],
            "extraction_date": res["extraction_date"],
            "device_id": res["device_id"],
        }
        notice_data_dict = {
            "date": res["date"],
            "status": res["status"],
            "status_icon": res["status_icon"],
            "status_raw": res["status_raw"],
            "message": res["message"],
            "sensor_id": sensor_id,
        }

        insert_into_table(self.cursor, "sensors", sensor_data_dict)
        self.connection.commit()
        notice_id = insert_into_table(self.cursor, "notices", notice_data_dict)
        self.connection.commit()
        update_into_table(
            self.cursor, "sensors", {"id": sensor_id, "notice_id": notice_id}
        )
        self.connection.commit()

        query = f"""SELECT date, status, status_icon, status_raw, message, sensor_id FROM notices
        WHERE sensor_id = '{sensor_id}' AND NOT id = {notice_id}"""
        self.extract_old_save("notices", "notices", query, False)




if __name__ == "__main__":
    with DBMigrate(conn, "theborges_dev_old") as db:
        ...

    conn.close()
