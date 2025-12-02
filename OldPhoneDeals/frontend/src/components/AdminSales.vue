<template>
  <div class="admin-sales">
    <header class="header">
      <h2>Sales and Activity Logs</h2>
      <div class="actions">
        
        <select v-model="exportFormat">
          <option value="csv">Export CSV</option>
          <option value="json">Export JSON</option>
        </select>
        <button @click="doExport">Export</button>
      </div>
    </header>

    <div class="filters">
      <label>
        From:
        <input type="date" v-model="start" />
      </label>
      <label>
        To:
        <input type="date" v-model="end" />
      </label>
    </div>

    <table v-if="filteredLogs.length">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Buyer</th>
          <th>Items & Quantities</th>
          <th>Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in filteredLogs" :key="log.id">
          <td>{{ formatTimestamp(log.timestamp) }}</td>
          <td>{{ log.buyerName }}</td>
          <td>
            <ul class="items-list">
              <li v-for="item in log.items" :key="item.productId">
                {{ item.title }} × {{ item.quantity }}
              </li>
            </ul>
          </td>
          <td>£{{ log.total.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No confirmed transactions found.</p>
  </div>
</template>

<script>
import api from '@/api/api.js'
import { getUserNameById } from '@/api/api'

export default {
  name: 'AdminSales',
  data() {
    return {
      logs: [],            
      start: '',           
      end: '',             
      exportFormat: 'csv', 
      lastCount: 0,        
      hasNew: false        
    }
  },
  computed: {
    filteredLogs() {
      return this.logs
        .filter(l => l.confirmed)
        .filter(l => {
          const logDate = new Date(l.timestamp)
          const startDate = this.start ? new Date(this.start) : null
          const endDate   = this.end   ? new Date(this.end)   : null

          return (!startDate || logDate >= startDate) &&
                 (!endDate   || logDate <= endDate)
        })
    }

  },
  async created() {
    await this.fetchLogs()
    //count the number
    this.lastCount = this.filteredLogs.length
  },
  methods: {
    async fetchLogs() {
      try {
        // Step 1: Fetch raw logs from backend
        const res = await api.get('/admin/logs')
        const arr = Array.isArray(res.data) ? res.data : res.data.data

        // Step 2: Preprocess logs and store actorId for later name lookup
        const rawLogs = arr.map(log => ({
          id:         log._id || log.id,
          timestamp:  log.timestamp || log.date,
          actorId:    log.actor, // will be used to fetch name
          items:      log.metadata?.items || [],
          total: Number(log.metadata?.totalAmount || log.metadata?.total || 0),
          confirmed:  log.action === 'CONFIRMED_ORDER'
        }))

        // Step 3: Collect all unique actorIds
        const uniqueActorIds = [...new Set(rawLogs.map(log => log.actorId))]

        // Step 4: Fetch user info for each actorId
        const actorMap = {}  // id → full name
        for (const id of uniqueActorIds) {
          try {
            const res = await getUserNameById(id)
            actorMap[id] = res.data.name || 'Unknown'
          } catch (err) {
            actorMap[id] = 'Unknown'
          }
        }

        // Step 5: Attach buyer names back to logs
        this.logs = rawLogs.map(log => ({
          ...log,
          buyerName: actorMap[log.actorId] || 'Unknown'
        }))

        // Step 6: Handle notification
        const current = this.filteredLogs.length
        if (current > this.lastCount) {
          this.hasNew = true
          this.notifyNew(current - this.lastCount)
        }
        this.lastCount = current
      } catch (err) {
        console.error('Failed to load logs:', err)
      }
    },
    formatTimestamp(ts) {
      return ts ? new Date(ts).toLocaleString() : '-'
    },
    doExport() {
      const baseName = 'Sales and Activity Logs'
      if (this.exportFormat === 'csv') {
        this.exportCSV(baseName + '.csv')
      } else {
        this.exportJSON(baseName + '.json')
      }
    },
    exportCSV(filename) {
      const header = ['Timestamp','Buyer','Items & Quantities','Total']
      const rows = this.filteredLogs.map(l => [
        `"${this.formatTimestamp(l.timestamp)}"`,
        `"${l.buyerName}"`,
        `"${l.items.map(i=>`${i.title}×${i.quantity}`).join('; ')}"`,
        l.total.toFixed(2)
      ])
      const csv = [header, ...rows].map(r => r.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      this.downloadBlob(blob, filename)
    },
    exportJSON(filename) {
      const data = this.filteredLogs.map(l => ({
        timestamp: l.timestamp,
        buyer:     l.buyerName,
        items:     l.items,
        total:     l.total
      }))
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      this.downloadBlob(blob, filename)
    },
    downloadBlob(blob, filename) {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      URL.revokeObjectURL(link.href)
    }
  }
}
</script>

<style scoped>
.admin-sales {
  font-family: sans-serif;
  padding: 1rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.actions {
  display: flex;
  align-items: center;
}
.notify {
  cursor: pointer;
  margin-right: 8px;
  font-size: 1.2em;
  color: red;
}
.filters {
  margin: 1rem 0;
}
.filters label {
  margin-right: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}
.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
  