// Can be useful to include as an option to array filter functions
// to extend functionality and add clarity.
//
// Example: Consider the function,
//
// filterByColor(items, 'red')
//
// We can add an optional Filter parameter:
//
// filterByColor(items, 'red', Filter.IncludeOnly)  - Returns red items
// filterByColor(items, 'red', Filter.Exclude)      - Returns non-red items
//
// And we can of course make Filter optional, and use a sensible default
// if filter is undefined.
//
enum Filter {
  Exclude,
  IncludeOnly
}

export default Filter
