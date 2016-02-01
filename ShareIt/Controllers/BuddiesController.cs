using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ShareIt.Models;

namespace ShareIt.Controllers
{
    public class BuddiesController : ApiController
    {
        private ShareResourcesEntities db = new ShareResourcesEntities();

        // GET: api/Buddies
        public IQueryable<Buddy> GetBuddies()
        {
            return db.Buddies;
        }

        // GET: api/Buddies/5
        [ResponseType(typeof(IQueryable<Student>))]
        public IHttpActionResult GetBuddy(int id)
        {
            IEnumerable<Buddy> buddies = db.Buddies.Where(b => b.StudentId == id);
            if (buddies.Count() == 0)
            {
                return NotFound();
            }

            var students = buddies.Select(b =>
            {
                var student = db.Students.Find(b.BuddyId);
                utils.CensorStudent(student);
                return student;
            });

            return Ok(students);
        }

        // PUT: api/Buddies/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutBuddy(int id, Buddy buddy)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != buddy.Id)
            {
                return BadRequest();
            }

            db.Entry(buddy).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BuddyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Buddies
        [ResponseType(typeof(Buddy))]
        public async Task<IHttpActionResult> PostBuddy(Buddy buddy)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (buddy.BuddyId == buddy.StudentId)
            {
                return BadRequest();
            }

            db.Buddies.Add(buddy);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = buddy.Id }, buddy);
        }

        // DELETE: api/Buddies/5
        [ResponseType(typeof(Buddy))]
        public async Task<IHttpActionResult> DeleteBuddy(int id)
        {
            Buddy buddy = await db.Buddies.FindAsync(id);
            if (buddy == null)
            {
                return NotFound();
            }

            db.Buddies.Remove(buddy);
            await db.SaveChangesAsync();

            return Ok(buddy);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BuddyExists(int id)
        {
            return db.Buddies.Count(e => e.Id == id) > 0;
        }
    }
}