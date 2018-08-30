export type SortDescriptor = any;

export type FilterDescriptor = any;

/**
 * Adapter for DataManager
 */
export default interface Adapter {
	filter(items: any[], descriptor: FilterDescriptor): any[];
	sort(items: any[], descriptor: SortDescriptor): any[];
}
