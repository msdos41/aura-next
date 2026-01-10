import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import { DB_NAME, DB_VERSION, type WindowState, type Workspace, type SystemSettings } from './constants'

interface ChromeOSDB extends DBSchema {
  windows: {
    key: string
    value: WindowState
  }
  workspaces: {
    key: string
    value: Workspace
  }
  settings: {
    key: string
    value: SystemSettings & { key: string }
  }
}

let db: IDBPDatabase<ChromeOSDB> | null = null

export async function initDB(): Promise<IDBPDatabase<ChromeOSDB>> {
  if (db) return db

  db = await openDB<ChromeOSDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('windows')) {
        db.createObjectStore('windows', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('workspaces')) {
        db.createObjectStore('workspaces', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
    },
  })

  return db
}

export async function getDB(): Promise<IDBPDatabase<ChromeOSDB>> {
  if (!db) {
    db = await initDB()
  }
  return db
}

export const dbAPI = {
  async getAllWindows(): Promise<WindowState[]> {
    const database = await getDB()
    return database.getAll('windows')
  },

  async getWindow(id: string): Promise<WindowState | undefined> {
    const database = await getDB()
    return database.get('windows', id)
  },

  async putWindow(window: WindowState): Promise<void> {
    const database = await getDB()
    await database.put('windows', window)
  },

  async deleteWindow(id: string): Promise<void> {
    const database = await getDB()
    await database.delete('windows', id)
  },

  async clearWindows(): Promise<void> {
    const database = await getDB()
    await database.clear('windows')
  },

  async getAllWorkspaces(): Promise<Workspace[]> {
    const database = await getDB()
    return database.getAll('workspaces')
  },

  async putWorkspace(workspace: Workspace): Promise<void> {
    const database = await getDB()
    await database.put('workspaces', workspace)
  },

  async deleteWorkspace(id: string): Promise<void> {
    const database = await getDB()
    await database.delete('workspaces', id)
  },

  async getSettings(): Promise<SystemSettings | undefined> {
    const database = await getDB()
    return database.get('settings', 'main')
  },

  async putSettings(settings: SystemSettings): Promise<void> {
    const database = await getDB()
    await database.put('settings', { ...settings, key: 'main' })
  },
}
