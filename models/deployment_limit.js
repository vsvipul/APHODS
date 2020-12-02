class DeploymentLimit {
    constructor(dao) {
      this.dao = dao;
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS deployment_limit (
        val INT unsigned)`;
      return this.dao.run(sql);
    }

    setCount(val) {
        return this.dao.run(
            'INSERT INTO deployment_limit (val) VALUES (?)',
            [val]);
    }

    deleteCount() {
        return this.dao.run(
            `DELETE FROM deployment_limit`);
    }

    getCount() {
        return this.dao.get(
            `SELECT val FROM deployment_limit`);
    }
  }
  
  module.exports = DeploymentLimit;
