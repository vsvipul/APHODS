class DockerDetails {
    constructor(dao) {
      this.dao = dao;
    }

    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS docker_details(
        userid TEXT,
        containerid TEXT,
        subdomain TEXT,
        port NUMBER,
        passwd TEXT
      )`;
      return this.dao.run(sql);
    }

    getDetails(userid) {
      return this.dao.get(
        `SELECT * FROM docker_details where userid=?`,[userid]);
    }

    insertDetail(userid, containerid, subdomain, port, passwd) {
      return this.dao.run(
        'INSERT INTO docker_details (userid, containerid, subdomain, port, passwd) VALUES (?, ?, ?, ?, ?)',
        [userid, containerid, subdomain, port, passwd]);
    }

    removeDetails(userid) {
      return this.dao.run(
        'DELETE FROM docker_details WHERE userid=?',
        [userid]);
    }
}

module.exports = DockerDetails;