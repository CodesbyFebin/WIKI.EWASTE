import entitiesData from './entities.json'

const entities = entitiesData.entities as Entity[]

export interface Entity {
  id: string
  name: string
  fullName: string
  description: string
  type: 'methodology' | 'standard' | 'organization' | 'regulation' | 'location'
  relatedHubs: string[]
}

export interface EntityLink {
  entityId: string
  articleSlug: string
  category: string
  context: string
}

/**
 * Get entity by ID
 */
export function getEntity(id: string): Entity | undefined {
  return entities.find((e) => e.id === id)
}

/**
 * Get all entities
 */
export function getAllEntities(): Entity[] {
  return entities
}

/**
 * Get entities by type
 */
export function getEntitiesByType(
  type: Entity['type']
): Entity[] {
  return entities.filter((e) => e.type === type)
}

/**
 * Get entities related to a hub
 */
export function getEntitiesByHub(hub: string): Entity[] {
  return entities.filter((e) =>
    e.relatedHubs.includes(hub)
  )
}

/**
 * Find entity by name (case-insensitive partial match)
 */
export function findEntityByName(query: string): Entity | undefined {
  const lowerQuery = query.toLowerCase()
  return entities.find(
    (e) =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.fullName.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Extract entities mentioned in article text
 * Looks for entity names and abbreviations
 */
export function extractMentionedEntities(text: string): Entity[] {
  const mentioned = new Set<Entity>()

  entities.forEach((entity) => {
    // Check for entity name
    if (text.includes(entity.name)) {
      mentioned.add(entity)
    }
    // Check for entity full name
    if (text.includes(entity.fullName)) {
      mentioned.add(entity)
    }
  })

  return Array.from(mentioned)
}

/**
 * Generate schema.org Breadcrumb structure for entity mentions
 */
export function generateEntitySchema(entities: Entity[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entities.map((entity, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: entity.name,
      item: `https://wiki.ewastekochi.com/entity/${entity.id}`,
    })),
  }
}

/**
 * Get related articles via entity linking
 * (placeholder for future integration with article index)
 */
export function getRelatedArticlesByEntity(
  entityId: string,
  currentArticleSlug: string
): string[] {
  const entity = getEntity(entityId)
  if (!entity) return []

  // This would integrate with article index in a full implementation
  // For now, return related hubs
  return entity.relatedHubs
}
