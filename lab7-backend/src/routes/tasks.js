const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const auth = require("../middleware/auth");
const paginate = require("../middleware/paginate");

/*  GET /tasks?skip=0&limit=20&cardId=3  */
router.get("/", auth(["READ"]), paginate, async (req, res) => {
  const { cardId } = req.query;      // opțional: filtrezi pe un card
  const where = cardId ? { cardId: +cardId } : {};

  const tasks = await prisma.task.findMany({
    where,
    skip: req.pagination.skip,
    take: req.pagination.take,
  });
  res.json(tasks);
});

/*  POST /tasks  */
router.post("/", auth(["WRITE"]), async (req, res) => {
  try {
    const { cardId, text } = req.body;
    const task = await prisma.task.create({ data: { text, cardId } });
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/*  PATCH /tasks/:id  */
router.patch("/:id", auth(["WRITE"]), async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: { id: +req.params.id },
      data: req.body,
    });
    res.json(task);
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
});

/*  DELETE /tasks/:id  */
router.delete("/:id", auth(["WRITE"]), async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: +req.params.id } });
    res.sendStatus(204);
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
});

module.exports = router;
