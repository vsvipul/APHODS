class DeploymentCount {
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS deployment_count (
        val INT unsigned)`
      return this.dao.run(sql)
    }

    initCount() {
        return this.dao.run(
            'INSERT INTO deployment_count (val) VALUES (0)')
    }

    increaseCount() {
        return this.dao.run(
            'UPDATE deployment_count SET val = val + 1');
    }

    decreaseCount() {
        return this.dao.run(
            'UPDATE deployment_count SET val = val - 1');
    }

    getCount() {
        return this.dao.get(
            `SELECT val FROM deployment_count`);
    }

  }
  
  module.exports = DeploymentCount;
