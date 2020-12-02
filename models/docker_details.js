class DockerDetails {
    constructor(dao) {
      this.dao = dao;
    }

    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS docker_details(
        userid TEXT,
        subdomain TEXT,
        port NUMBER
      )`;
      return this.dao.run(sql);
    }

    getDetails(userid) {
      return this.dao.get(
        `SELECT * FROM docker_details where userid=?`,[userid]);
    }

    insertDetail(userid, subdomain, port) {
      return this.dao.run(
        'INSERT INTO docker_details (userid, subdomain, port) VALUES (?, ?, ?)',
        [userid, subdomain, port]);
    }

    removeDetails(userid) {
      return this.dao.run(
        'DELETE FROM docker_details WHERE userid=?',
        [userid]);
    }
}

module.exports = DockerDetails;