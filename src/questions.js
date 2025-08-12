export const questions = 
[
  {
    "id": 1,
    "type": "multiple",
    "question": "根据笔记内容，关于Java集合（Collection）与数组（Array）的对比，以下哪些说法是正确的？",
    "options": [
      "数组的长度是不可变的，而集合的长度是可变的。",
      "数组可以存储基本数据类型和引用数据类型，而集合只能存储引用数据类型。",
      "当处理一组数量在运行时可能动态变化的数据时，集合是比数组更好的选择。",
      "集合的底层数据结构只能是链表或哈希表，而数组是连续的内存空间。"
    ],
    "answer": [
      "数组的长度是不可变的，而集合的长度是可变的。",
      "数组可以存储基本数据类型和引用数据类型，而集合只能存储引用数据类型。",
      "当处理一组数量在运行时可能动态变化的数据时，集合是比数组更好的选择。"
    ],
    "score": 3,
    "explanation": "这是集合与数组最核心的区别。集合的底层数据结构是多样的，包括数组（如ArrayList）、链表（如LinkedList）、哈希表（如HashSet）、红黑树（如TreeSet）等，所以选项D是错误的。"
  },
  {
    "id": 2,
    "type": "single",
    "question": "在Java集合框架中，哪一个顶层接口用于表示键值对（Key-Value Pair）的集合？",
    "options": ["Collection", "List", "Set", "Map"],
    "answer": "Map",
    "score": 1,
    "explanation": "笔记中明确指出，Java集合框架分为两大顶层接口：`Collection`用于处理独立的、单个的元素；`Map`用于处理键值对数据。"
  },
  {
    "id": 3,
    "type": "short_answer",
    "question": "请简述`List`和`Set`接口在核心特性上的主要区别。",
    "answer": "`List`接口的特点是元素有序（按插入顺序存储）且可重复。`Set`接口的特点是元素通常无序（不保证插入顺序）且不可重复。",
    "score": 2.5,
    "explanation": "这是对`Collection`两大核心子接口基本特征的考察，理解它们的区别是选择正确集合类的第一步。"
  },
  {
    "id": 4,
    "type": "single",
    "question": "在何种业务场景下，使用`LinkedList`会比`ArrayList`具有明显的性能优势？",
    "options": [
      "需要频繁地根据索引随机访问集合中的元素。",
      "集合中绝大多数操作是遍历元素。",
      "需要频繁地在列表的头部和尾部进行插入和删除操作。",
      "集合创建后，元素数量固定不变，主要用于存储和读取。"
    ],
    "answer": "需要频繁地在列表的头部和尾部进行插入和删除操作。",
    "score": 3,
    "explanation": "根据笔记中的选型总结，`LinkedList`的底层是双向链表，对头尾节点的操作时间复杂度为O(1)，远优于`ArrayList`的O(n)。而随机访问是`ArrayList`的强项（O(1)）。"
  },
  {
    "id": 5,
    "type": "multiple",
    "question": "关于`ArrayList`的底层实现和特性，以下哪些说法是正确的？",
    "options": [
      "它的底层数据结构是动态数组。",
      "通过索引`get(index)`访问元素的时间复杂度为O(1)。",
      "在列表的中间位置插入或删除元素，其时间复杂度通常为O(n)。",
      "当容量不足时，`ArrayList`会自动扩容，创建一个更大的新数组并复制所有旧元素。"
    ],
    "answer": [
      "它的底层数据结构是动态数组。",
      "通过索引`get(index)`访问元素的时间复杂度为O(1)。",
      "在列表的中间位置插入或删除元素，其时间复杂度通常为O(n)。",
      "当容量不足时，`ArrayList`会自动扩容，创建一个更大的新数组并复制所有旧元素。"
    ],
    "score": 4,
    "explanation": "这四个选项全面地概括了`ArrayList`的核心工作原理和性能特点，这些都是Java开发中必须掌握的基础知识。"
  },
  {
    "id": 6,
    "type": "short_answer",
    "question": "为什么在创建 `ArrayList` 时，推荐指定一个预估的初始容量（如 `new ArrayList(100)`）？这样做有什么好处？",
    "answer": "推荐指定初始容量是为了性能优化。如果预先知道大致的数据量，指定初始容量可以避免或减少`ArrayList`在添加元素过程中因超出容量而触发的多次“扩容”操作。因为每次扩容都需要创建新数组并复制旧数组的全部元素，这是一个耗时的过程。",
    "score": 3,
    "explanation": "这是一个重要的性能优化技巧。在能预估数据量的场景下（例如，从数据库一次性查询N条记录放入List），指定初始容量是专业开发者的习惯。"
  },
  {
    "id": 7,
    "type": "code",
    "question": "请使用 `LinkedList` 的特有API，模拟一个栈（Stack）的入栈（push）和出栈（pop）操作。假设 `LinkedList<String> stack = new LinkedList<>();`",
    "answer": "// 入栈 \nstack.push(\"element1\"); \n// 或者 \nstack.addFirst(\"element1\"); \n\n// 出栈 \nString element = stack.pop(); \n// 或者 \nString element = stack.removeFirst();",
    "score": 3.5,
    "explanation": "笔记中提到`LinkedList`实现了`Deque`接口，因此提供了`push`和`pop`等方法，可以方便地作为栈使用。这考察了对`LinkedList`作为双端队列/栈使用的熟悉程度。"
  },
  {
    "id": 8,
    "type": "single",
    "question": "引入泛型（Generics）最主要的目标是什么？",
    "options": [
      "提升集合的运行效率。",
      "减少代码量。",
      "将类型检查从运行时提前到编译时，以提供类型安全。",
      "实现集合的多态性，让 `List<Dog>` 成为 `List<Animal>` 的子类。"
    ],
    "answer": "将类型检查从运行时提前到编译时，以提供类型安全。",
    "score": 2,
    "explanation": "泛型的核心价值在于类型安全。它允许编译器在编译阶段就发现类型不匹配的错误，避免了在运行时可能出现的`ClassCastException`，并免去了繁琐的手动类型转换。"
  },
  {
    "id": 9,
    "type": "short_answer",
    "question": "根据笔记，请解释为什么`List<User>`不是`List<Person>`的子类型，即使`User`是`Person`的子类？这个特性叫什么？",
    "answer": "这个特性叫做“泛型不具有多态性”。`List<User>`和`List<Person>`是两种完全不同的类型，它们之间没有继承关系。如果允许这种赋值（`List<Person> pList = new ArrayList<User>()`），那么之后就可以通过`pList.add(new Animal())`向一个本应只存放`User`的集合中添加其他类型的对象，这将破坏泛型的类型安全保证。",
    "score": 3.5,
    "explanation": "这是一个泛型中非常重要且容易混淆的概念。理解这一点对于正确使用泛型和理解泛型通配符（如`? extends Person`）至关重要。"
  },
  {
    "id": 10,
    "type": "multiple",
    "question": "要确保一个自定义类的对象能够在`HashSet`中正确地实现唯一性（即内容相同的对象被视为同一个），必须采取哪些措施？",
    "options": [
      "该类必须实现`Serializable`接口。",
      "该类必须重写`equals()`方法，定义对象内容相等的逻辑。",
      "该类必须重写`hashCode()`方法，并保证`equals()`为`true`的两个对象其`hashCode()`返回值也必须相等。",
      "该类必须实现`Comparable`接口。"
    ],
    "answer": [
      "该类必须重写`equals()`方法，定义对象内容相等的逻辑。",
      "该类必须重写`hashCode()`方法，并保证`equals()`为`true`的两个对象其`hashCode()`返回值也必须相等。"
    ],
    "score": 4,
    "explanation": "`HashSet`的唯一性判断依赖于`hashCode()`和`equals()`这两个方法。`hashCode()`用于快速定位存储位置，`equals()`用于在哈希冲突时进行精确比较。两者必须同时被正确重写，否则会导致集合行为异常。"
  },
  {
    "id": 11,
    "type": "short_answer",
    "question": "请简述当向一个`HashSet`中`add(element)`一个新元素时，其内部的详细工作流程。",
    "answer": "1. 首先调用`element`的`hashCode()`方法计算哈希码，通过哈希算法定位到底层`HashMap`中的一个桶（bucket）位置。\n2. 如果该桶为空，直接将元素存入，添加成功。\n3. 如果该桶不为空（发生哈希冲突），则遍历桶中的所有现有元素。\n4. 使用新元素`element`的`equals()`方法与桶内每个现有元素进行比较。\n5. 如果有任何一次`equals()`比较返回`true`，则认为元素已存在，添加失败。\n6. 如果遍历完所有元素，`equals()`都返回`false`，则将新元素添加到这个桶中（通常是链表或红黑树的末尾），添加成功。",
    "score": 4.5,
    "explanation": "这个问题深入考察了`HashSet`唯一性保证的底层原理，是Java面试中关于集合部分的高频考点，体现了对数据结构实现的深入理解。"
  },
  {
    "id": 12,
    "type": "single",
    "question": "根据笔记，`HashSet`的底层是使用哪一个集合类来实现其功能的？",
    "options": ["ArrayList", "TreeMap", "LinkedList", "HashMap"],
    "answer": "HashMap",
    "score": 2,
    "explanation": "笔记中明确指出，`HashSet`内部持有一个`HashMap`实例。添加到`HashSet`中的元素实际上是作为`key`存储在内部的`HashMap`中，而`value`则是一个固定的占位对象。"
  },
  {
    "id": 13,
    "type": "multiple",
    "question": "关于`HashMap`和`Hashtable`的对比，下列说法正确的有哪些？",
    "options": [
      "`HashMap`是非线程安全的，而`Hashtable`是线程安全的。",
      "`HashMap`允许一个null键和多个null值，而`Hashtable`不允许任何null键或null值。",
      "在新代码中，如果需要线程安全的Map，应优先选择`Hashtable`而不是`ConcurrentHashMap`。",
      "`HashMap`和`Hashtable`的默认初始容量和扩容机制完全相同。"
    ],
    "answer": [
      "`HashMap`是非线程安全的，而`Hashtable`是线程安全的。",
      "`HashMap`允许一个null键和多个null值，而`Hashtable`不允许任何null键或null值。"
    ],
    "score": 3.5,
    "explanation": "`Hashtable`是遗留的线程安全类，性能较差，现代并发编程推荐使用`ConcurrentHashMap`。`HashMap`和`Hashtable`的初始容量和扩容策略也不同。因此C和D是错误的。"
  },
  {
    "id": 14,
    "type": "single",
    "question": "在遍历一个`Map`集合时，哪种遍历方式被认为是最高效的，为什么？",
    "options": [
      "遍历`keySet()`，因为key是唯一的。",
      "遍历`values()`，因为直接获取值最快。",
      "遍历`entrySet()`，因为它可以一次性获取到key和value。",
      "使用迭代器遍历`keySet()`，因为迭代器最标准。"
    ],
    "answer": "遍历`entrySet()`，因为它可以一次性获取到key和value。",
    "score": 3,
    "explanation": "遍历`keySet()`后，还需要通过`map.get(key)`再次查找`value`，这在`HashMap`中涉及到一次额外的哈希定位。而遍历`entrySet()`，每个`Map.Entry`对象已经包含了`key`和`value`，无需二次查找，因此效率最高。"
  },
  {
    "id": 15,
    "type": "code",
    "question": "请补全以下代码，使用推荐的方式（`entrySet`）遍历一个`HashMap`并打印其所有键值对。",
    "answer": "Map<Integer, String> map = new HashMap<>();\nmap.put(1, \"Java\");\nmap.put(2, \"Python\");\n\nSet<Map.Entry<Integer, String>> entries = map.entrySet();\nfor (Map.Entry<Integer, String> entry : entries) {\n    System.out.println(entry.getKey() + \" -> \" + entry.getValue());\n}",
    "score": 3.5,
    "explanation": "考察对`Map`最高效遍历方式`entrySet`的实际编码能力，这是日常开发中的常用代码片段。"
  },
  {
    "id": 16,
    "type": "short_answer",
    "question": "什么是`ConcurrentModificationException`？在什么情况下会发生？",
    "answer": "`ConcurrentModificationException`（并发修改异常）是一个运行时异常。它通常发生在使用迭代器（包括增强for循环）遍历一个集合的过程中，同时又通过集合自身的方法（如`list.add()`, `map.remove()`）对集合的结构进行了修改（添加或删除元素）。",
    "score": 3.5,
    "explanation": "理解这个异常的触发条件是避免在集合遍历中踩坑的关键。根本原因在于迭代器维护的状态（如`expectedModCount`）与集合的实际状态（`modCount`）不一致了。"
  },
  {
    "id": 17,
    "type": "code",
    "question": "以下代码在运行时会抛出异常。请修改它，使其能够在遍历`List`时安全地删除所有包含\"bad\"的字符串。",
    "code_prompt": "List<String> list = new ArrayList<>(Arrays.asList(\"good\", \"bad\", \"nice\", \"bad idea\"));\nfor (String s : list) {\n    if (s.contains(\"bad\")) {\n        list.remove(s); \n    }\n}",
    "answer": "List<String> list = new ArrayList<>(Arrays.asList(\"good\", \"bad\", \"nice\", \"bad idea\"));\nIterator<String> iterator = list.iterator();\nwhile (iterator.hasNext()) {\n    String s = iterator.next();\n    if (s.contains(\"bad\")) {\n        iterator.remove(); // 使用迭代器的remove方法\n    }\n}",
    "score": 4,
    "explanation": "此题是`ConcurrentModificationException`的经典场景。正确做法是使用迭代器自身的`remove()`方法进行删除，因为该方法会同步集合和迭代器两者的内部状态，从而避免异常。"
  },
    {
    "id": 18,
    "type": "multiple",
    "question": "关于`Queue`接口中的`add`、`offer`、`put`三个用于插入元素的方法，以下描述正确的有哪些？",
    "options": [
      "`add(e)`在队列已满时会抛出`IllegalStateException`异常。",
      "`offer(e)`在队列已满时会返回`false`，而不会抛出异常。",
      "`put(e)`是`BlockingQueue`特有的方法，在队列已满时会阻塞当前线程，直到队列有空间。",
      "在任何情况下，这三个方法的行为都是完全一样的。"
    ],
    "answer": [
      "`add(e)`在队列已满时会抛出`IllegalStateException`异常。",
      "`offer(e)`在队列已满时会返回`false`，而不会抛出异常。",
      "`put(e)`是`BlockingQueue`特有的方法，在队列已满时会阻塞当前线程，直到队列有空间。"
    ],
    "score": 4,
    "explanation": "Queue接口为增删查操作提供了三套API，分别应对不同场景。`add`系列是“暴力派”，失败就抛异常；`offer`系列是“温柔派”，失败返回特殊值；`put`/`take`系列是“阻塞派”，专为并发场景设计。理解它们的区别对于编写健壮的程序至关重要。"
  },
  {
    "id": 19,
    "type": "multiple",
    "question": "与`Queue`的插入方法类似，其移除元素的`remove()`、`poll()`、`take()`方法也有不同行为。以下描述正确的有哪些？",
    "options": [
      "`remove()`在队列为空时会抛出`NoSuchElementException`异常。",
      "`poll()`在队列为空时会返回`null`。",
      "`take()`在队列为空时会阻塞线程，直到队列中有元素可取。",
      "对于非阻塞队列，`remove()`和`poll()`是完全等价的。"
    ],
    "answer": [
      "`remove()`在队列为空时会抛出`NoSuchElementException`异常。",
      "`poll()`在队列为空时会返回`null`。",
      "`take()`在队列为空时会阻塞线程，直到队列中有元素可取。"
    ],
    "score": 4,
    "explanation": "这考察了`Queue`三套API中用于移除元素的方法。在实际开发中，尤其是在高并发或需要处理边界条件的系统中，通常会选择使用`poll()`或`take()`来避免程序因异常而中断。"
  },
  {
    "id": 20,
    "type": "single",
    "question": "假设你正在开发一个生产者-消费者模型，使用`ArrayBlockingQueue`作为共享缓冲区。当缓冲区已满时，你希望生产者线程暂停等待，而不是抛出异常或立即返回失败。你应该使用哪个方法来放入元素？",
    "options": ["add(e)", "offer(e)", "put(e)", "push(e)"],
    "answer": "put(e)",
    "score": 3,
    "explanation": "根据笔记中对`ArrayBlockingQueue`的描述，`put(e)`方法正是在队列满时提供阻塞功能的API，这完全符合生产者-消费者模型中生产者需要等待的场景。"
  },
    {
    "id": 21,
    "type": "code",
    "question": "请编写一个`Comparator`，用于对一个`List<String>`按字符串长度进行降序排序。如果长度相同，则按字典序升序排序。",
    "answer": "list.sort((s1, s2) -> {\n    if (s1.length() != s2.length()) {\n        return s2.length() - s1.length(); // 长度降序\n    } else {\n        return s1.compareTo(s2); // 字典序升序\n    }\n});",
    "score": 4.5,
    "explanation": "本题考察了`Comparator`接口的灵活运用，涉及两个排序维度（主、次排序条件），是实际开发中常见的自定义排序场景。使用Lambda表达式是现代Java的推荐写法。"
  },
  {
    "id": 22,
    "type": "single",
    "question": "在使用`Arrays.binarySearch()`方法进行二分查找前，对目标数组有什么样的前置要求？",
    "options": [
      "数组必须是`String`类型。",
      "数组必须已经排好序。",
      "数组长度必须是2的幂。",
      "数组不能包含重复元素。"
    ],
    "answer": "数组必须已经排好序。",
    "score": 2.5,
    "explanation": "二分查找算法的有效性建立在数据有序的基础上。如果在一个未排序的数组上执行`binarySearch`，其结果是未定义的，可能会返回错误的位置或找不到存在的元素。"
  },
  {
    "id": 23,
    "type": "single",
    "question": "调用`Map.put(K key, V value)`方法时，如果`key`在Map中已经存在，会发生什么？",
    "options": [
      "操作失败，抛出异常。",
      "操作失败，返回`false`。",
      "旧的`value`被新的`value`覆盖，方法返回新的`value`。",
      "旧的`value`被新的`value`覆盖，方法返回被覆盖的旧`value`。"
    ],
    "answer": "旧的`value`被新的`value`覆盖，方法返回被覆盖的旧`value`。",
    "score": 2,
    "explanation": "这是`Map.put`方法的一个重要特性。返回旧值使得调用者可以知道之前该key关联的值是什么，方便进行一些如“更新并记录旧值”的逻辑。"
  },
  {
    "id": 24,
    "type": "short_answer",
    "question": "在使用增强for循环（for-each loop）遍历一个List时，其底层实际上是如何工作的？为什么它同样会受到`ConcurrentModificationException`的影响？",
    "answer": "增强for循环在底层实际上是依赖`Iterator`（迭代器）工作的。编译器会将增强for循环代码转换为等效的使用`iterator()`方法获取迭代器，然后循环调用`hasNext()`和`next()`的代码。因为它本质上就是在使用迭代器，所以当在循环体内部通过集合自身的方法修改集合时，同样会触发`ConcurrentModificationException`。",
    "score": 3,
    "explanation": "理解增强for循环的语法糖本质有助于更深刻地理解Java的迭代机制和并发修改异常的根源。"
  },
  {
    "id": 25,
    "type": "single",
   "question": "如果一个自定义类只重写了`equals()`方法，而没有重写`hashCode()`方法，并将其对象作为元素添加到`HashSet`中，可能会导致什么问题？",
    "options": [
      "编译错误。",
      "运行时抛出`IllegalStateException`。",
      "两个内容相等（`equals`返回`true`）的对象可能都会被成功添加到`HashSet`中。",
      "性能下降，但功能完全正常。"
    ],
    "answer": "两个内容相等（`equals`返回`true`）的对象可能都会被成功添加到`HashSet`中。",
    "score": 4,
    "explanation": "如果没有重写`hashCode()`，它将使用从`Object`类继承的默认实现，该实现通常基于内存地址生成哈希码。因此，两个内容相同但内存地址不同的对象会有不同的哈希码，`HashSet`会将它们定位到不同的桶中，从而都添加成功，违背了`Set`的唯一性原则。"
  },
  {
    "id": 26,
    "type": "single",
    "question": "根据`Comparator<T>`接口的`compare(T o1, T o2)`方法的约定，如果要实现升序排序，当`o1`应该排在`o2`前面时，该方法应该返回什么？",
    "options": ["正整数", "负整数", "零", "true"],
    "answer": "负整数",
    "score": 3,
    "explanation": "这是`Comparator`接口的核心约定：返回负数意味着第一个参数`o1`“小于”第二个参数`o2`，应该排在前面；返回正数相反；返回零表示两者相等。"
  },
  {
    "id": 27,
    "type": "multiple",
    "question": "`LinkedList`实现了哪些重要的接口（根据笔记内容）？",
    "options": ["List", "Map", "Set", "Deque"],
    "answer": ["List", "Deque"],
    "score": 2,
    "explanation": "笔记中明确指出 `LinkedList` 是 `List` 接口的实现，同时它也实现了 `Deque` (双端队列) 接口，这使得它既有列表的特性，也具备队列和栈的能力。"
  },
  {
    "id": 28,
    "type": "short_answer",
    "question": "请描述`ArrayList`和`LinkedList`在内存开销上的主要区别。",
    "answer": "`ArrayList`的内存开销相对较小。它只需要存储元素本身，以及一些额外的容量信息。其内存是连续的。`LinkedList`的内存开销较大，因为它的每个元素都包装在一个节点（Node）对象中，该节点除了存储元素数据外，还需额外存储指向前一个和后一个节点的引用（指针），这增加了额外的内存占用。",
    "score": 3,
    "explanation": "在处理大量数据且内存敏感的场景下，内存开销是选择集合实现时需要考虑的一个因素。"
  },
  {
    "id": 29,
    "type": "single",
    "question": "执行`new ArrayList()`后，此时`ArrayList`的内部数组容量是多少？",
    "options": ["10", "16", "0", "1"],
    "answer": "0",
    "score": 2.5,
    "explanation": "根据笔记，JDK 7及以后的版本，`new ArrayList()`会创建一个初始容量为0的空列表（内部数组是一个空数组）。在第一次调用`add`方法时，才会进行第一次扩容，通常是分配一个容量为10的数组。"
  },
  {
    "id": 30,
    "type": "single",
    "question": "`map.values()`方法返回的是什么类型？",
    "options": ["List<V>", "Set<V>", "Collection<V>", "V[]"],
    "answer": "Collection<V>",
    "score": 2,
    "explanation": "`map.values()`返回一个`Collection`视图，因为它只保证包含了map中所有的值，但不保证顺序或唯一性（不同的key可以映射到相同的value）。因此，使用最泛化的`Collection`类型是合适的。"
  },
  {
    "id": 31,
    "type": "short_answer",
    "question": "为什么说遍历Map的`entrySet()`是最高效的方式？请从`HashMap`的实现角度解释。",
    "answer": "因为`HashMap`的`entrySet()`返回的`Set`中，每个`Entry`对象已经包含了键和值。遍历时，可以直接从`Entry`对象中获取`key`和`value`。相比之下，遍历`keySet()`时，在循环体内部需要通过`map.get(key)`来获取`value`，这个`get`操作需要根据`key`的哈希值再次进行一次查找定位过程。因此，遍历`entrySet()`避免了这次重复的查找，效率更高。",
    "score": 4,
    "explanation": "此题要求从`HashMap`的实现细节来解释性能差异，考察对`HashMap`工作原理的理解深度。"
  },
  {
    "id": 32,
    "type": "single",
    "question": "一个`HashMap`实例中，可以存在多少个`null`作为`key`？",
    "options": ["0个", "1个", "无限个", "不确定，取决于JDK版本"],
    "answer": "1个",
    "score": 2,
    "explanation": "笔记中明确提到，`HashMap`允许`key`和`value`为`null`。由于`key`必须是唯一的，所以最多只能有一个`key`为`null`。而`value`可以有多个为`null`。"
  },
  {
    "id": 33,
    "type": "code",
    "question": "给定一个`ArrayList<Integer> list`，请使用`list.sort()`方法和Lambda表达式对其进行降序排序。",
    "answer": "list.sort((o1, o2) -> o2 - o1);",
    "score": 3,
    "explanation": "考察使用Lambda表达式快速实现`Comparator`接口，这是Java 8以后推荐的简洁写法。`o2 - o1`是实现Integer降序排序的经典技巧。"
  },
  {
    "id": 34,
    "type": "multiple",
    "question": "以下关于`Iterator`迭代器的说法，哪些是正确的？",
    "options": [
      "`Iterator`是遍历集合的统一标准接口。",
      "调用`next()`方法会返回下一个元素，并且会自动将内部指针后移。",
      "在通过迭代器遍历集合时，可以使用迭代器自身的`remove()`方法安全地删除元素。",
      "所有的`Collection`实现类都必须实现`Iterator`接口。"
    ],
    "answer": [
      "`Iterator`是遍历集合的统一标准接口。",
      "调用`next()`方法会返回下一个元素，并且会自动将内部指针后移。",
      "在通过迭代器遍历集合时，可以使用迭代器自身的`remove()`方法安全地删除元素。"
    ],
    "score": 3.5,
    "explanation": "选项D是错误的。`Collection`的实现类并未直接实现`Iterator`接口，而是提供了一个`iterator()`方法来返回一个`Iterator`的实例。其他三项都是对`Iterator`核心功能和用法的正确描述。"
  },
  {
    "id": 35,
    "type": "single",
    "question": "如果`HashMap`的key是一个自定义对象，那么这个对象必须满足什么条件才能保证`HashMap`的正常工作？",
    "options": [
      "必须实现`Comparable`接口。",
      "必须是不可变对象（Immutable）。",
      "必须正确地重写`hashCode()`和`equals()`方法。",
      "必须有一个无参构造函数。"
    ],
    "answer": "必须正确地重写`hashCode()`和`equals()`方法。",
    "score": 3,
    "explanation": "与`HashSet`一样，`HashMap`通过key的`hashCode()`和`equals()`来定位和区分不同的条目。为了确保能够正确地存取键值对，这两个方法必须被正确重写。虽然将不可变对象用作key是最佳实践，但不是强制要求。"
  },
  {
    "id": 36,
    "type": "single",
    "question": "在Java中，如果一个方法需要接收一个`List`，这个`List`中可以存放`Integer`或任何`Integer`的父类型（如`Number`, `Object`），那么该方法的参数类型应该如何声明？",
    "options": [
      "`List<Number> list`",
      "`List<? extends Number> list`",
      "`List<? super Integer> list`",
      "`List<Object> list`"
    ],
    "answer": "`List<? super Integer> list`",
    "score": 4.5,
    "explanation": "这是一个关于泛型通配符的进阶问题，虽然笔记中没有直接讲授通配符，但是基于“泛型不具有多态性”的概念延伸而来。`? super Integer`表示一个未知类型，这个类型是`Integer`本身或者其任何父类型，符合题意。这考察了对泛型更深层次的理解（PECS原则：Producer-Extends, Consumer-Super）。"
  },
  {
    "id": 37,
    "type": "short_answer",
    "question": "请解释`ArrayList`的`remove(int index)`和`remove(Object o)`两个重载方法之间的区别和潜在的陷阱。",
    "answer": "`remove(int index)`是按索引删除，它会删除指定位置的元素并返回被删除的元素。`remove(Object o)`是按内容删除，它会删除集合中与对象`o`相等的第一个元素，并返回一个布尔值（`true`表示删除成功）。潜在的陷阱是当`ArrayList`中存储的是`Integer`类型时，如果调用`list.remove(10)`，编译器会优先匹配`remove(int index)`，意图是删除索引为10的元素，而不是内容为10的元素。如果想按内容删除，必须传递一个`Integer`对象，如`list.remove(Integer.valueOf(10))`。",
    "score": 4,
    "explanation": "这个问题考察了对`ArrayList` API细节的掌握，特别是在处理`Integer`集合时由于自动装箱/拆箱可能引发的歧义和错误，非常具有实践性。"
  },
  {
    "id": 38,
    "type": "single",
    "question": "`Queue`接口遵循的基本原则是什么？",
    "options": ["后进先出 (LIFO)", "先进先出 (FIFO)", "无序", "按优先级"],
    "answer": "先进先出 (FIFO)",
    "score": 1.5,
    "explanation": "笔记中明确定义，Queue (队列) 是一种遵循先进先出 (FIFO, First-In-First-Out) 原则的特殊线性表。"
  },
  {
    "id": 39,
    "type": "single",
    "question": "以下哪个操作在`LinkedList`上的时间复杂度是O(n)？",
    "options": [
      "`addFirst(e)`",
      "`removeLast()`",
      "`get(int index)`",
      "`add(e)` (即 addLast)"
    ],
    "answer": "`get(int index)`",
    "score": 2.5,
    "explanation": "`LinkedList`由于是链表结构，无法直接通过计算内存地址偏移来访问元素，随机访问`get(index)`需要从头或尾开始遍历，直到找到第index个节点，所以时间复杂度是O(n)。而头尾操作都是O(1)。"
  },
  {
    "id": 40,
    "type": "short_answer",
    "question": "`Iterator`的`remove()`方法为什么是安全的，而集合的`remove()`方法在迭代时会不安全？请从`modCount`的角度解释。",
    "answer": "集合内部有一个`modCount`变量，记录集合结构被修改的次数。当创建迭代器时，迭代器会保存一份当前集合的`modCount`值（称为`expectedModCount`）。在迭代过程中，如果通过集合自身的`remove()`方法修改了集合，只会增加集合的`modCount`，而迭代器的`expectedModCount`没有变。下一次迭代器操作（如`next()`）会检查到`modCount != expectedModCount`，于是抛出`ConcurrentModificationException`。\n而`Iterator.remove()`方法是安全的，因为它在内部删除元素的同时，会主动更新迭代器自身的`expectedModCount`使其与集合的`modCount`保持同步，所以不会触发异常。",
    "score": 4.5,
    "explanation": "这是对并发修改异常底层机制的深度考察，能回答这个问题说明对`Iterator`的工作原理有非常清晰的认识。"
  },
  {
    "id": 41,
    "type": "multiple",
    "question": "`java.util.Arrays`工具类提供了哪些常用功能？",
    "options": [
      "`toString(array)`: 将数组转换为字符串。",
      "`sort(array)`: 对数组进行排序。",
      "`binarySearch(array, key)`: 在有序数组中进行二分查找。",
      "`toList(array)`: 直接将任何数组高效转换为`ArrayList`。"
    ],
    "answer": [
      "`toString(array)`: 将数组转换为字符串。",
      "`sort(array)`: 对数组进行排序。",
      "`binarySearch(array, key)`: 在有序数组中进行二分查找。"
    ],
    "score": 3,
    "explanation": "`Arrays`类没有`toList()`方法。将数组转为List通常使用`Arrays.asList()`，但它返回的是一个内部类的`List`，该`List`长度固定，不支持`add`或`remove`操作。所以选项D描述不准确。"
  },
  {
    "id": 42,
    "type": "single",
    "question": "对于一个已经存储了1000个元素的`ArrayList`，在列表的起始位置（索引0）插入一个新元素，大约需要执行多少次元素移动操作？",
    "options": ["1次", "2次", "1000次", "不需要移动"],
    "answer": "1000次",
    "score": 3,
    "explanation": "在`ArrayList`的起始位置插入元素，为了给新元素腾出空间，原有的所有1000个元素都需要向后移动一位。这是一个典型的O(n)操作，n是集合的大小。"
  },
  {
    "id": 43,
    "type": "single",
    "question": "以下哪种集合实现类在迭代时能保证元素的顺序与其插入时的顺序一致？",
    "options": ["HashSet", "HashMap", "ArrayList", "TreeSet"],
    "answer": "ArrayList",
    "score": 2,
    "explanation": "`ArrayList`和`LinkedList`都属于`List`，保证了元素的插入顺序。`HashSet`和`HashMap`是无序的。`TreeSet`和`TreeMap`会根据元素的自然顺序或指定的`Comparator`进行排序，而不是插入顺序。（注：`LinkedHashSet`和`LinkedHashMap`可以保证插入顺序，但笔记未提及）"
  },
  {
    "id": 44,
    "type": "code",
    "question": "如果有一个`User`类，包含`id`和`name`属性。请重写其`equals()`方法，使得只有当`id`和`name`都相同时，两个`User`对象才被认为是相等的。",
    "answer": "@Override\npublic boolean equals(Object obj) {\n    if (this == obj) return true;\n    if (obj == null || getClass() != obj.getClass()) return false;\n    User otherUser = (User) obj;\n    return this.id == otherUser.id && java.util.Objects.equals(this.name, otherUser.name);\n}",
    "score": 3.5,
    "explanation": "考察`equals`方法的标准写法，包括地址比较、null检查和类型检查等前置判断。使用`Objects.equals()`来处理`name`可能为null的情况，是更健壮的写法。"
  },
  {
    "id": 45,
    "type": "short_answer",
    "question": "泛型中的“类型擦除”（Type Erasure）是什么意思？它对Java的泛型实现意味着什么？",
    "answer": "类型擦除是指Java泛型信息只存在于代码的编译阶段，在生成的字节码中，所有的泛型类型参数都会被替换为它们的上界（如`T`被替换为`Object`，`T extends Number`被替换为`Number`），并插入必要的类型转换代码。这意味着，对于JVM来说，`ArrayList<String>`和`ArrayList<Integer>`在运行时是同一个类（`ArrayList.class`），它并不知道集合中元素的确切泛型类型。",
    "score": 4,
    "explanation": "虽然笔记中只提到了泛型是编译期机制，但理解类型擦除是深入理解泛型本质的关键。这个问题考察了对这一核心概念的认知。"
  },
  {
    "id": 46,
    "type": "single",
    "question": "当不再推荐使用`Hashtable`时，如果需要一个线程安全的`Map`实现，应该优先选择哪个类？",
    "options": ["Collections.synchronizedMap(new HashMap())", "ConcurrentHashMap", "TreeMap", "自己用`synchronized`关键字包装HashMap的所有方法"],
    "answer": "ConcurrentHashMap",
    "score": 3,
    "explanation": "笔记中提到，`ConcurrentHashMap`提供了比`Hashtable`更好的并发性能。`ConcurrentHashMap`使用了更先进的锁机制（如分段锁或CAS），在高并发场景下，其吞吐量远超于对整个`Map`进行同步的`Hashtable`或`Collections.synchronizedMap`。"
  },
  {
    "id": 47,
    "type": "multiple",
    "question": "以下关于`HashSet`的说法，哪些是正确的？",
    "options": [
      "它不允许存储重复的元素。",
      "它通常不保证元素的存储和取出顺序。",
      "它允许存储一个`null`元素。",
      "它的所有操作都是线程安全的。"
    ],
    "answer": [
      "它不允许存储重复的元素。",
      "它通常不保证元素的存储和取出顺序。",
      "它允许存储一个`null`元素。"
    ],
    "score": 3,
    "explanation": "`HashSet`的核心特性就是无序、唯一，并允许一个null。与`HashMap`一样，它本身是非线程安全的。需要线程安全的Set可以使用`Collections.synchronizedSet()`或`ConcurrentHashMap.newKeySet()`。"
  },
  {
    "id": 48,
    "type": "single",
    "question": "如果一个`ArrayList`的`remove(Object o)`方法被调用，它会如何查找要删除的元素？",
    "options": [
      "使用二分查找。",
      "通过哈希定位。",
      "从头到尾依次遍历，使用`equals()`方法进行比较。",
      "从尾到头依次遍历，使用`==`进行比较。"
    ],
    "answer": "从头到尾依次遍历，使用`equals()`方法进行比较。",
    "score": 2.5,
    "explanation": "`ArrayList`的`remove(Object o)`实现是线性搜索，它会从列表的第一个元素开始，逐个调用`equals()`方法进行匹配，直到找到第一个匹配的元素并删除它。因此其时间复杂度是O(n)。"
  },
  {
    "id": 49,
    "type": "short_answer",
    "question": "在Java中，为何推荐使用接口（如`List`、`Map`）作为变量声明类型或方法参数类型，而不是具体的实现类（如 `ArrayList`、`HashMap`）？",
    "answer": "这是面向接口编程的一种体现，主要有以下好处：\n1. **解耦和灵活性**：代码不依赖于具体的实现细节。未来如果发现`ArrayList`性能不佳，可以很方便地将其替换为`LinkedList`或其他`List`实现，而不需要修改大量使用该`List`的代码。\n2. **可扩展性**：使代码更加通用，可以接受任何符合该接口规范的实现类的对象。\n3. **符合设计原则**：符合“依赖倒置原则”，即应该依赖于抽象，而不是依赖于具体。",
    "score": 3.5,
    "explanation": "这是一个非常重要的编程实践问题，考察了对面向对象设计原则的理解。例如，声明 `List<String> users = new ArrayList<>();` 好于 `ArrayList<String> users = new ArrayList<>();`。"
  },
  {
    "id": 50,
    "type": "code",
    "question": "假设有一个`Map<String, Integer> map`，其中一个键为\"b\"。以下这段删除操作的代码有什么问题？应该如何修正？\n\nfor (String key : map.keySet()) {\n    if (\"b\".equals(key)) {\n        map.remove(\"b\");\n    }\n}",
    "answer": "问题：这段代码会在运行时抛出`ConcurrentModificationException`，因为在通过`keySet`的迭代器进行遍历时，使用了`map`自身的方法`remove`来修改集合结构。\n\n修正：应该使用迭代器自身的`remove`方法进行删除。\n\nIterator<String> iterator = map.keySet().iterator();\nwhile (iterator.hasNext()) {\n    String key = iterator.next();\n    if (\"b\".equals(key)) {\n        iterator.remove(); // 正确做法\n    }\n}",
    "score": 4,
    "explanation": "这是并发修改异常的又一个经典案例，这次是发生在`Map`的遍历中。它强化了“在迭代过程中必须使用迭代器自己的方法来修改集合”这一黄金法则。"
  }
]

/**
 * Calculates the grade based on the score.
 * S: 90-100
 * A: 80-89
 * B: 70-79
 * C: 60-69
 * D: 0-59
 * @param {number} score - The total score.
 * @returns {string} The grade.
 */
export const getGrade = (score) => {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
};
